
import templateUrl from './mbFileInput.html';
import './mbFileInput.css';

/**

@ngInject
 */
export default  function($q, $timeout) {

	function genLfObjId() {
		return 'mbobjyxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};

	function parseFileType(file) {
		var type = file.type;
		var name = file.name;
		if (isImageType(type, name)) {
			return "image";
		} else if (isVideoType(type, name)) {
			return "video";
		} else if (isAudioType(type, name)) {
			return "audio";
		}
		return "object";
	};

	function isImageType(type, name) {
		return (type.match('image.*') || name.match(/\.(gif|png|jpe?g)$/i)) ? true : false;
	};

	function isVideoType(type, name) {
		return (type.match('video.*') || name.match(/\.(og?|mp4|webm|3gp)$/i)) ? true : false;
	};

	function isAudioType(type, name) {
		return (type.match('audio.*') || name.match(/\.(ogg|mp3|wav)$/i)) ? true : false;
	};

	function genmbFileObj(file) {
		file.key = genLfObjId();
		file.media = parseFileType(file);
		file.isRemote = false;
		file.url = URL.createObjectURL(file);
		// Old data type
		//		var mbFileObj = {
		//			key: genLfObjId(),
		//			mbFile: file,
		//			mbFileName: file.name,
		//			mbFileType: file.type,
		//			mbTagType: parseFileType(file),
		//			mbDataUrl: window.URL.createObjectURL(file),
		//			isRemote: false
		//		};
		return file;
	}

	var genRemotembFileObj = function(url, fileName, fileType) {
		return {
			key: genLfObjId(),
			//			"mbFile": void 0,
			name: fileName,
			type: fileType,
			media: parseFileType({
				name: fileName,
				type: fileType
			}),
			url: url,
			isRemote: true
		};
	}

	return {
		restrict: 'E',
		templateUrl: templateUrl,
		replace: true,
		require: 'ngModel',
		scope: {
			mbApi: '=?',
			//			mbOption: '=?',
			mbCaption: '@?',
			mbPlaceholder: '@?',
			mbDragAndDropLabel: '@?',
			mbBrowseLabel: '@?',
			mbRemoveLabel: '@?',
			mbSubmitLabel: '@?',
			mbAccept: '@?',
			// events
			mbOnFileClick: '=?',
			mbOnSubmitClick: '=?',
			mbOnFileRemove: '=?',
		},

		link: function(scope, element, attrs, ngModel) {

			/*
			Working with date model. All data models fetch from ngModel
			
			hre is old model
			scope.mbFiles = [];
			scope[attrs.ngModel] = scope.mbFiles;
			
			*/
			ngModel.$render = function() {
				scope.mbFiles = ngModel.$modelValue || [];
			};


			var elDragview = angular.element(element[0].querySelector('.mb-file-input-drag'));
			var elThumbnails = angular.element(element[0].querySelector('.mb-file-input-thumbnails'));
			var intFilesCount = 0;
			loadView();
			loadLabels();
			loadApi();

			/*
			Opens file dialog to select a file
			*/
			scope.openDialog = function(event/*, el*/) {
				event.preventDefault();
				event.stopPropagation();
				// open file
				var input = document.createElement('input')
				if (scope.isMutiple) {
					input.setAttribute('multiple', '');
				}
				input.setAttribute('accept', scope.mbAccept || '');
				input.setAttribute('aria-label', scope.strAriaLabel || 'input file');
				input.setAttribute('type', 'file');
				// IE10/11 Addition
				input.style.display = 'none';
				input.setAttribute('id', 'mb-file-hidden-file');
				document.body.appendChild(input);

				input.addEventListener('change', function() {
					onFileChanged(input.files)
					document.body.removeChild(input)
				});

				// Simluate click event
				var evt = document.createEvent('MouseEvents');
				evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
				input.dispatchEvent(evt);
			};

			/*
			 * Remove all files and update the ngModel
			 */
			scope.removeAllFilesWithoutVaildate = function() {
				removeAllFiles();
			};

			scope.removeAllFiles = function(/*event*/) {
				scope.removeAllFilesWithoutVaildate();
			};

			/*
			 * Remove a file by name
			 */
			scope.removeFileByName = function(name/*, event*/) {
				scope.mbFiles.every(function(obj, idx) {
					if (obj.name == name) {
						scope.mbFiles.splice(idx, 1);
						// TODO: update ngModel
						return false;
					}
					return true;
				});
			};


			/*
			 * Remove an specific file
			 */
			scope.removeFile = function(mbFile) {
				scope.mbFiles.every(function(obj, idx) {
					if (obj.key == mbFile.key) {
						if (angular.isFunction(scope.mbOnFileRemove)) {
							scope.mbOnFileRemove(obj, idx);
						}
						removeFileByIndex(idx);
						return false;
					}
					return true;
				});
			};

			//call back function
			scope.onFileClick = function(mbFile) {
				if (_.isFunction(scope.mbOnFileClick)) {
					scope.mbFiles.every(function(obj, idx) {
						if (obj.key == mbFile.key) {
							scope.mbOnFileClick(obj, idx);
							return false;
						} else {
							return true;
						}
					});
				}
			};

			scope.onSubmitClick = function() {
				if (angular.isFunction(scope.mbOnSubmitClick)) {
					scope.mbOnSubmitClick(scope.mbFiles);
				}
			};

			elDragview.bind('dragover', function(e) {
				e.stopPropagation();
				e.preventDefault();
				if (!scope.isDrag) {
					return;
				}
				elDragview.addClass('mb-file-input-drag-hover');
			});

			elDragview.bind('dragleave', function(e) {
				e.stopPropagation();
				e.preventDefault();
				if (!scope.isDrag) {
					return;
				}
				elDragview.removeClass('mb-file-input-drag-hover');
			});

			elDragview.bind("drop", function(e) {
				e.stopPropagation();
				e.preventDefault();
				if (/*scope.isDisabled || */!scope.isDrag) {
					return;
				}
				elDragview.removeClass('mb-file-input-drag-hover');
				if (angular.isObject(e.originalEvent)) {
					e = e.originalEvent;
				}
				var files = e.target.files || e.dataTransfer.files;
				var i = 0;
				var lfAccept = scope.mbAccept.replace(/,/g, '|');
				var regexp = new RegExp(lfAccept, "i");
				var regFiles = [];
				angular.forEach(files, function(file) {
					if (file.type.match(regexp)) {
						regFiles.push(file);
					}
				});
				onFileChanged(regFiles);
			});

			function loadApi() {
				scope.mbApi = new function() {
					var self = this;
					self.removeAll = function() {
						scope.removeAllFiles();
					};

					self.removeByName = function(name) {
						scope.removeFileByName(name);
					};

					self.addRemoteFile = function(url, name, type) {
						var obj = genRemotembFileObj(url, name, type);
						addFile(obj);
					};
				};
			}
			function loadView() {
				scope.intLoading = 0;
				scope.floatProgress = 0;
				scope.isCustomCaption = false;

				scope.isPreview = angular.isDefined(attrs.mbPreview);
				scope.isDrag = angular.isDefined(attrs.mbDrag);
				scope.isMutiple = angular.isDefined(attrs.mbMultiple);
				scope.isProgress = angular.isDefined(attrs.mbProgress);
				scope.isSubmit = angular.isDefined(attrs.mbSubmit);
				//				scope.accept = scope.mbAccept || '';
			}

			function loadLabels() {
				scope.strCaption = '';
				scope.strCaptionPlaceholder = 'Select file';
				scope.strCaptionDragAndDrop = 'Drag & drop files here...';
				scope.strCaptionBrowse = 'Browse';
				scope.strCaptionRemove = 'Remove';
				scope.strCaptionSubmit = 'Submit';
				scope.strAriaLabel = '';

				if (angular.isDefined(attrs.ariaLabel)) {
					scope.strAriaLabel = attrs.ariaLabel;
				}

				if (angular.isDefined(attrs.mbPlaceholder)) {
					scope.$watch('mbPlaceholder', function(newVal) {
						scope.strCaptionPlaceholder = newVal;
					});
				}

				if (angular.isDefined(attrs.mbCaption)) {
					scope.isCustomCaption = true;
					scope.$watch('mbCaption', function(newVal) {
						scope.strCaption = newVal;
					});
				}
				if (scope.mbDragAndDropLabel) {
					scope.strCaptionDragAndDrop = scope.mbDragAndDropLabel;
				}
				if (scope.mbBrowseLabel) {
					scope.strCaptionBrowse = scope.mbBrowseLabel;
				}
				if (scope.mbRemoveLabel) {
					scope.strCaptionRemove = scope.mbRemoveLabel;
				}
				if (scope.mbSubmitLabel) {
					scope.strCaptionSubmit = scope.mbSubmitLabel;
				}
			}

			function onFileChanged(files) {
				if (files.length <= 0) {
					return;
				}
				scope.floatProgress = 0;
				if (scope.isMutiple) {
					intFilesCount = files.length;
					scope.intLoading = intFilesCount;
					for (var i = 0; i < files.length; i++) {
						var file = files[i];
						setTimeout(readFile(file), i * 100);
					}
				} else {
					intFilesCount = 1;
					scope.intLoading = intFilesCount;
					for (var i = 0; i < files.length; i++) {
						var file = files[i];
						scope.removeAllFilesWithoutVaildate();
						readFile(file);
						break;
					}
				}
			}

			function readFile(file) {
				readAsDataURL(file).then(function(/*result*/) {
					var isFileAreadyExist = false;
					scope.mbFiles.every(function(mbFile) {
						if (mbFile.isRemote) {
							return true;
						}
						if (mbFile.name !== undefined && mbFile.name == file.name) {
							if (mbFile.size == file.size) {
								if (mbFile.lastModified == file.lastModified) {
									isFileAreadyExist = true;
								}
							}
							return false;
						} else {
							return true;
						}
					});

					if (!isFileAreadyExist) {
						var obj = genmbFileObj(file);
						addFile(obj);
					}
				}, function(/*error*/) { }, function(/*notify*/) { });
			};
			
			
			function removeAllFiles(){
				scope.mbFiles.length = 0;
				elThumbnails.empty();
				pushModelChange();
			}

			function removeFileByIndex(idx) {
				scope.mbFiles.splice(idx, 1);
				pushModelChange();
			}

			function addFile(file) {
				scope.mbFiles.push(file);
				pushModelChange();
			}

			function pushModelChange(){
				// update ngModel
				ngModel.$setViewValue(_.clone(scope.mbFiles));
				ngModel.$commitViewValue();
			}
			
			/*
			Read remote data from URL
			*/
			function readAsDataURL(file, index) {
				var deferred = $q.defer();
				var reader = new FileReader();
				reader.onloadstart = function() {
					deferred.notify(0);
				};
				reader.onload = function(/*event*/) { };
				reader.onloadend = function(/*event*/) {
					deferred.resolve({
						'index': index,
						'result': reader.result
					});
					scope.intLoading--;
					scope.floatProgress = (intFilesCount - scope.intLoading) / intFilesCount * 100;
				};
				reader.onerror = function(/*event*/) {
					deferred.reject(reader.result);
					scope.intLoading--;
					scope.floatProgress = (intFilesCount - scope.intLoading) / intFilesCount * 100;
				};
				reader.onprogress = function(event) {
					deferred.notify(event.loaded / event.total);
				};
				reader.readAsArrayBuffer(file);
				return deferred.promise;
			};
		}
	};
}



// NOTE: ng-disabled add disabled attribute to the elemtn. CSS must be used to disabele the view
// 1. to define desiabe
//			scope.isDisabled = false;
//			if (angular.isDefined(attrs.ngDisabled)) {
//				scope.$watch('ngDisabled', function(isDisabled) {
//					scope.isDisabled = isDisabled;
//				});
//			}

// NOTE: vies must mainpulate via CSS and theme
//			scope.strBrowseIconCls = "lf-browse";
//			scope.strRemoveIconCls = "lf-remove";
//			scope.strCaptionIconCls = "lf-caption";
//			scope.strSubmitIconCls = "lf-submit";
//			scope.strUnknowIconCls = "lf-unknow";
//
//			scope.strBrowseButtonCls = "md-primary";
//			scope.strRemoveButtonCls = "";
//			scope.strSubmitButtonCls = "md-accent";
//			if (angular.isDefined(attrs.mbOption)) {
//				if (angular.isObject(scope.mbOption)) {
//					if (scope.mbOption.hasOwnProperty('browseIconCls')) {
//						scope.strBrowseIconCls = scope.mbOption.browseIconCls;
//					}
//					if (scope.mbOption.hasOwnProperty('removeIconCls')) {
//						scope.strRemoveIconCls = scope.mbOption.removeIconCls;
//					}
//					if (scope.mbOption.hasOwnProperty('captionIconCls')) {
//						scope.strCaptionIconCls = scope.mbOption.captionIconCls;
//					}
//					if (scope.mbOption.hasOwnProperty('unknowIconCls')) {
//						scope.strUnknowIconCls = scope.mbOption.unknowIconCls;
//					}
//					if (scope.mbOption.hasOwnProperty('submitIconCls')) {
//						scope.strSubmitIconCls = scope.mbOption.submitIconCls;
//					}
//					if (scope.mbOption.hasOwnProperty('strBrowseButtonCls')) {
//						scope.strBrowseButtonCls = scope.mbOption.strBrowseButtonCls;
//					}
//					if (scope.mbOption.hasOwnProperty('strRemoveButtonCls')) {
//						scope.strRemoveButtonCls = scope.mbOption.strRemoveButtonCls;
//					}
//					if (scope.mbOption.hasOwnProperty('strSubmitButtonCls')) {
//						scope.strSubmitButtonCls = scope.mbOption.strSubmitButtonCls;
//					}
//				}
//			}

