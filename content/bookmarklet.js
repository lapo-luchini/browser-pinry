void((function (d) {
    var prev = d.getElementById('pinry-bookmarklet');
    if (prev) // remove previous instance
        try {
            prev.remove();
            d.getElementById('pinry-images').remove();
        } finally {
            return;
        }
    
    // 직접 스크립트 실행 (외부 로드 대신)
    chrome.storage.local.get('pinryUrl', function (obj) {
        // pinryUrl을 전역으로 설정하여 스크립트에서 사용할 수 있도록 함
        window.pinryBookmarkletUrl = obj.pinryUrl;
        
        // 가상의 script 태그를 생성하여 getFormUrl이 작동하도록 함
        var virtualScript = d.createElement('script');
        virtualScript.id = 'pinry-bookmarklet';
        virtualScript.src = obj.pinryUrl + '/static/js/bookmarklet.js';
        d.body.appendChild(virtualScript);
        
        // 실제 북마클릿 코드 실행
        (function main() {
            'use strict';

            function closePinry() {
                var el = document.getElementById('pinry-images');
                if (el) el.parentNode.removeChild(el);
                el = document.getElementById('pinry-bookmarklet');
                if (el) el.parentNode.removeChild(el);
            }

            // Start Helper Functions
            function getFormUrl() {
                var src = document.getElementById('pinry-bookmarklet').src;
                src = src.substr(0, src.indexOf('/static/js'));
                return src + '/pin-creation/from-url?url=';
            }

            function setCSS(el, css) {
                for (var k in css)
                    el.style[k] = css[k];
            }
            // End Helper Functions

            // Start View Functions
            function pageView() {
                var pinryImages = document.createElement('div');
                pinryImages.id = 'pinry-images';
                setCSS(pinryImages, {
                    position: 'fixed',
                    display: 'block',
                    zIndex: 2147483647,
                    background: 'rgba(0, 0, 0, 0.7)',
                    paddingTop: '70px',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    overflowX: 'hidden',
                    overflowY: 'auto'
                });
                var pinryBar = document.createElement('div');
                pinryBar.id = 'pinry-bar';
                setCSS(pinryBar, {
                    display: 'block',
                    background: 'black',
                    padding: '15px',
                    position: 'absolute',
                    zIndex: 9002,
                    width: '100%',
                    top: 0,
                    borderBottom: '1px solid #555',
                    color: 'white',
                    textAlign: 'center',
                    fontSize: '22px'
                });
                pinryBar.textContent = 'Pinry Bookmarklet';
                pinryBar.onclick = closePinry;
                pinryImages.appendChild(pinryBar);
                var pinrySort = document.createElement('div');
                setCSS(pinrySort, {
                    display: 'block',
                    position: 'absolute',
                    top: '15px',
                    right: '1em',
                    cursor: 'pointer'
                });
                pinrySort.textContent = '\u21D5 Size';
                pinryBar.appendChild(pinrySort);
                document.body.appendChild(pinryImages);
                document.onkeyup = function (e) {
                    if (e.keyCode == 27) // ESC key
                        closePinry();
                };
                pinrySort.onclick = function (e) {
                    e.stopPropagation();
                    Array.prototype.slice.call(pinryImages.children
                    ).sort(function (a, b) {
                        return b.getAttribute('pinryArea') - a.getAttribute('pinryArea');
                    }).forEach(function (div) {
                        // re-add to parent in sorted order
                        pinryImages.appendChild(div);
                    });
                };
            }

            function imageView(imageUrl) {
                // Requires that pageView has been created already
                var image = document.createElement('div');
                setCSS(image, {
                    backgroundImage: 'url('+imageUrl+')',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    display: 'inline-block',
                    color: 'blue',
                    textShadow: 'yellow 0px 0px 2px, yellow 0px 0px 3px, yellow 0px 0px 4px',
                    width: '200px',
                    height: '200px',
                    margin: '15px',
                    cursor: 'pointer',
                    border: '1px solid #555'
                });
                image.onclick = function() {
                    var popUrl = getFormUrl() + encodeURIComponent(imageUrl);
                    popUrl = popUrl + '&referer=' + encodeURIComponent(window.location);
                    popUrl = popUrl + '&description=' + encodeURIComponent(document.title);
                    window.open(popUrl);
                    closePinry();
                };
                document.getElementById('pinry-images').appendChild(image);
                return image;
            }
            // End View Functions

            // Start Active Functions
            var images = {}, // cache URLs to avoid duplicates
                reURL = /url[(]"([^"]+)"[)]/; // match an URL in CSS
            function addImage(img) {
                if (images[img.src])
                    return;
                images[img.src] = true;
                var w = img.naturalWidth,
                    h = img.naturalHeight;
                    if (w > 200 && h > 200) {
                        var i = imageView(img.src);
                        i.textContent = w + '\u00D7' + h;
                        i.setAttribute('pinryArea', w * h);
                    }
                }
            function addAllImagesToPageView() {
                // add all explicit IMGs
                var images = document.getElementsByTagName('img');
                for (var i = 0; i < images.length; ++i)
                    addImage(images[i]);
                // add all background images
                ['body', 'div', 'td'].forEach(function (tagName) {
                     var tags = document.getElementsByTagName(tagName);
                     for (var i = 0; i < tags.length; ++i) {
                         var m = reURL.exec(tags[i].style.backgroundImage);
                         if (m) {
                             // load image to know size
                             var img = new Image();
                             img.onload = function () {
                                 addImage(this);
                             };
                             img.src = m[1];
                         }
                     }
                });
            }
            // End Active Functions

            // Start Init
            pageView(); // Build page before we insert images
            addAllImagesToPageView(); // Add all images on page to our new pageView
            // End Init
        })();
    });
})(document));