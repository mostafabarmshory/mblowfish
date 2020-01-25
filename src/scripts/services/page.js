/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


// TODO: hadi: move it to new module angular-material-home-seo
angular.module('mblowfish-core')

/**
 * @ngdoc service
 * @name $page
 * @description A page management service
 */
.service('$page', function(
		/* angularjs */ $rootScope, $rootElement, 
		/* wb-core */ $window) {

	// ------------------------------------------------------------------
	// Utility function
	//
	//
	// ------------------------------------------------------------------
	/*
	 * <!-- OG -->
	 * <meta property="og:site_name" content="$title">
	 */
	
	$rootScope.page = {
			title: '',
			description: '',
			keywords: [],
			links:[]
	};
	var page = $rootScope.page;
	var headElement = $rootElement.find('head');
	var bodyElement = $rootElement.find('body');
	
	/*
	 * Get elements by name
	 */
	function getHeadElementByName(name){
		var elements = headElement.find(name);
		if(elements.length){
			return angular.element(elements[0]);
		}
		// title element not found
		var metaElement = angular.element('<' + name +'/>');
		headElement.append(metaElement);
		return metaElement;
	}

	// ------------------------------------------------------------------
	// Utility function
	//
	//
	// ------------------------------------------------------------------

	/**
	 * 
	 * @param title
	 * @returns
	 */
	this.setTitle = function(title){
		page.title = title;
		getHeadElementByName('title').text(title);
		this.setMeta('twitter:title', title);
		this.setMeta('og:title', title);
		return this;
	}

	/**
	 * Gets current page title
	 * 
	 * @returns
	 */
	this.getTitle = function (){
		return page.title;
	}

	/**
	 * Sets page description
	 * 
	 * @param description
	 * @returns
	 */
	this.setDescription = function (description){
		page.description = description;
		this.setMeta('description', description);
		this.setMeta('twitter:description', description);
		this.setMeta('og:description', description);
		return this;
	}

	/**
	 * 
	 * @returns
	 */
	this.getDescription = function (){
		return page.description;
	}

	/**
	 * 
	 * @param keywords
	 * @returns
	 */
	this.setKeywords = function (keywords){
		page.keywords = keywords;
		this.setMeta('keywords', keywords);
		return this;
	}

	/**
	 * Gets current keywords
	 * 
	 * @returns
	 */
	this.getKeywords = function (){
		return page.keywords;
	};
	
	/**
	 * Sets favicon
	 */
	this.setFavicon = function (favicon){
		this.updateLink('favicon-link', {
			href: favicon,
			rel: 'icon'
		});
		return this;
	};
	
	/**
	 * Sets page cover
	 */
	this.setCover = function(imageUrl) {
		this.setMeta('twitter:image', imageUrl);
		this.setMeta('og:image', imageUrl);
		return this;
	};
	
	this.setCanonicalLink = function(url) {
		this.setLink('canonical', {
			href: url,
			rel: 'canonical'
		});
		return this;
	};

	this.updateLink = function(key, data){
		$window.setLink(key, data);
		return this;
	};
	
	this.setLink = this.updateLink;

	this.setMeta = function (key, value){
		$window.setMeta(key, value);
		return this;
	};
	
	this.setLanguage = function(language){
		bodyElement.attr('lang', language);
		return this;
	};
	
	return this;
});
