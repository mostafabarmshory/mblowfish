///* 
// * The MIT License (MIT)
// * 
// * Copyright (c) 2016 weburger
// * 
// * Permission is hereby granted, free of charge, to any person obtaining a copy
// * of this software and associated documentation files (the "Software"), to deal
// * in the Software without restriction, including without limitation the rights
// * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// * copies of the Software, and to permit persons to whom the Software is
// * furnished to do so, subject to the following conditions:
// * 
// * The above copyright notice and this permission notice shall be included in all
// * copies or substantial portions of the Software.
// * 
// * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// * SOFTWARE.
// */
//'use strict';
//
//describe('Directive WbDialogWindow ', function () {
//    var WbDialogWindow;
//    var $document;
//    var $window; 
//
//
//    // load the service's module
//    beforeEach(module('mblowfish-core'));
//
//    // instantiate service
//    beforeEach(inject(function (_WbDialogWindow_, _$document_, _$window_) {
//        WbDialogWindow = _WbDialogWindow_;
//        $document = _$document_;
//        $window = _$window_;
//    }));
//
//    it(' $window is default parent', function () {
//        // create default window
//        var window = new WbDialogWindow();
//        expect(window.getParent()).toBe($window);
//    });
//
//    it(' must set title of the page', function () {
//        // create default window
//        var window = new WbDialogWindow();
//
//        var title = 'new title:' + Math.random();
//        window.setTitle(title);
//        expect(window.getTitle()).toBe(title);
//    });
//
//    it(' must set language of the window', function () {
//        // create default window
//        var window = new WbDialogWindow();
//
//        var language = 'lang' + Math.random();
//        window.setLanguage(language);
//        expect(window.getLanguage()).toBe(language);
//    });
//
//    it(' must set visible and hidden', function () {
//        // create default window
//        var window = new WbDialogWindow();
//
//        window.setVisible(true);
//        expect(window.isVisible()).toBe(true);
//
//        window.setVisible(false);
//        expect(window.isVisible()).toBe(false);
//    });
//
//    it(' must set visible and hidden (vice versa)', function () {
//        // create default window
//        var window = new WbDialogWindow();
//
//        window.setVisible(false);
//        expect(window.isVisible()).toBe(false);
//
//        window.setVisible(true);
//        expect(window.isVisible()).toBe(true);
//    });
//
//    it('must set meta', function () {
//        // create default window
//        var window = new WbDialogWindow();
//
//        var key = 'keym';
//        var value = 'value:' + Math.random();
//
//        window.setMeta(key, value);
//        window.setMeta(key, value);
//
//        // open with $window
//        window = $window.open('','Title', {
//            internal: true
//        }, false);
//        window.setMeta(key, value);
//        window.setMeta(key, value);
//
//        // open with $window
//        window = $window.open('','Title', {
//            internal: false
//        }, false);
//        window.setMeta(key, value);
//        window.setMeta(key, value);
//
//    });
//    
//    it('must set link', function () {
//        // create default window
//        var window = new WbDialogWindow();
//        
//        var key = 'keym';
//        var data = {
//                value: 'value'
//         }
//        
//        window.setLink(key, data);
//        window.setLink(key, data);
//        
//        // open with $window
//        window = $window.open('','Title', {
//            internal: true
//        }, false);
//        window.setLink(key, data);
//        window.setLink(key, data);
//        
//        // open with $window
//        window = $window.open('','Title', {
//            internal: false
//        }, false);
//        window.setLink(key, data);
//        window.setLink(key, data);
//    });
//    
//    it('must change position of the window', function () {
//        // create default window
//        var window = new WbDialogWindow();
//        var x = Math.floor(Math.random() * 1000);
//        var y = Math.floor(Math.random() * 1000);
//        
//        window.setPosition(x, y);
//        
//        var position = window.getPosition();
//        expect(position.x).toBe(x);
//        expect(position.y).toBe(y);
//
//        // open with $window
//        window = $window.open('','Title', {
//            internal: true,
//            position: {
//            	x: x,
//            	y: y
//            }
//        }, false);
//        position = window.getPosition();
//        expect(position.x).toBe(x);
//        expect(position.y).toBe(y);
//    });
//    
//    it('must change size of the window', function () {
//        // create default window
//        var window = new WbDialogWindow();
//        var w = Math.floor(Math.random() * 1000);
//        var h = Math.floor(Math.random() * 1000);
//        
//        window.setWidth(w);
//        expect(window.getWidth()).toBe(w);
//        
//        window.setHeight(h);
//        expect(window.getHeight()).toBe(h);
//        
//        // open with $window
//        window = $window.open('','Title', {
//            internal: true,
//            size: {
//            	width: w,
//            	height: h
//            }
//        }, false);
//        expect(window.getWidth()).toBe(w);
//        expect(window.getHeight()).toBe(h);
//    });
//    
//
//    
//    it('must set title visibility of the window', function () {
//        // create default window
//        var window = new WbDialogWindow();
//        window.setTitleVisible(false);
//        expect(window.isTitleVisible()).toBe(false);
//
//        window.setTitleVisible(true);
//        expect(window.isTitleVisible()).toBe(true);
//        
//        // open with $window
//        window = $window.open('','Title', {
//            internal: true,
//            showTitle: false
//        }, false);
//        expect(window.isTitleVisible()).toBe(false);
//        
//        window = $window.open('','Title', {
//        	internal: true,
//        	showTitle: true
//        }, false);
//        expect(window.isTitleVisible()).toBe(true);
//    });
//
//});
