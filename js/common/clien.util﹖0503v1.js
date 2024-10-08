function Util() {
	var _this = this;
	/**
	 * 로그 출력 (console.log)
	 * @param {Object} obj - 로깅대상
	 */
	_this.log = function(obj) {
		if (IS_DEBUG) {
			if (window.console != undefined && window.console.log != undefined) {
				console.log(obj);
			}
		}
	};

	/**
	 * 로그 출력 (console.dir)
	 * @param {Object} obj - 로깅대상
	 */
	_this.dir = function(obj) {
		if (IS_DEBUG) {
			if (window.console != undefined && window.console.dir != undefined) {
				console.dir(obj);
			}
		}
	};

	/**
	 * URL String으로부터 Param 가져오기
	 * @param {String} url - URL
	 * @param {String} key - Key
	 */
	_this.getParam = function(url, key){
		var _parammap = {};
		//document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
		url.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
			function decode(s) {
				return decodeURIComponent(s.split("+").join(" "));
			}
			_parammap[decode(arguments[1])] = decode(arguments[2]);
		});
		return _parammap[key];
	};

	/**
	 * HTML 태그 제거
	 * @param {String} str - 대상 문자열
	 */
	_this.stripTags = function(str) {
		return str.replace(/(<([^>]+)>)/ig,'');
	};

	/**
	 * HTML 태그 제거 (댓글 등록시)
	 * @param {String} str - 대상 문자열
	 */
	_this.stripTagsForComment = function(str) {
		return str.replace(/<(SPAN|P|H1|H2){1}.*>/i,'');
	};

	/**
	 * HTML 이미지 테그만 삭제. ( 외부 이미지 url은 삭제하지 않는다. )
	 */
	_this.removeImgTags = function(str) {
		var tmpStr = new RegExp();
		 tmpStr = /[<]img class=\"fr-dib fr-fil\"[^>]*[>]/gi;
		 return str.replace(tmpStr , "");
	};

	_this.stripTags2 = function(input, allowed) {
		allowed = (((allowed || '') + '')
		.toLowerCase()
		.match(/<[a-z][a-z0-9]*>/g) || [])
		.join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
		var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
		commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
		return input.replace(commentsAndPhpTags, '')
		.replace(tags, function($0, $1) {
		  return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
		});
	}

	/**
	 * 금칙어 관련 처리
	 */
	_this.prohibitionWord = function(content, prohibitionWord) {
		var prohibitionWordCheck = {};
		var isValidWord = true;
		var banWordIdx = 0;
		var prohibitionWordList = prohibitionWord.split(',');
		while ( banWordIdx <= prohibitionWordList.length - 1 ) {
			if( content.indexOf(prohibitionWordList[banWordIdx]) > -1 ) {
				content = _this.replaceAll(content, prohibitionWordList[banWordIdx], '*');
				isValidWord = false;
			}
			banWordIdx++;
		}
		prohibitionWordCheck.isValidWord = isValidWord;
		prohibitionWordCheck.content = content;
		return prohibitionWordCheck;
	};

	/**
	 * 회원 닉 벨리데이션 확인
	 */
	_this.nickVaild = function(nick){
		var re = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣_!~@#$%^&*(),.;?\[\]\-+=\'\"]{2,20}$/;
		if(re.test(nick)){
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Replace All
	 * @param {String} str 			- 대상 문자열
	 * @param {String} searchStr 	- 검색할 문자열
	 * @param {String} replaceStr 	- 변환할 문자열
	 */
	_this.replaceAll = function(str, searchStr, replaceStr){
		return str.split(searchStr).join(replaceStr);
	};

	/**
	 * getTextNodeIn
	 * @param {Object} node 	- 엘리먼트
	 */
	var getTextNodesIn = function(node) {
		var textNodes = [];
		if (node.nodeType == 3) {
			textNodes.push(node);
		} else {
			var children = node.childNodes;
			for (var i = 0, len = children.length; i < len; ++i) {
				textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
			}
		}
		return textNodes;
	}

	/**
	 * input, contenteditable dom 커서 선택
	 * @param {Object} el 		- 엘리먼트
	 * @param {Number} start 	- 커서 시작 지점
	 * @param {Number} end 		- 커서 종료 지점
	 */
	_this.setSelectionRange = function(el, start, end) {
		if (document.createRange && window.getSelection) {
			var range = document.createRange();
			range.selectNodeContents(el);
			var textNodes = getTextNodesIn(el);
			var foundStart = false;
			var charCount = 0, endCharCount;
			for (var i = 0, textNode; textNode = textNodes[i++]; ) {
				endCharCount = charCount + textNode.length;
				if (!foundStart && start >= charCount
						&& (start < endCharCount ||
						(start == endCharCount && i <= textNodes.length))) {
					range.setStart(textNode, start - charCount);
					foundStart = true;
				}
				if (foundStart && end <= endCharCount) {
					range.setEnd(textNode, end - charCount);
					break;
				}
				charCount = endCharCount;
			}
			var sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		} else if (document.selection && document.body.createTextRange) {
			var textRange = document.body.createTextRange();
			textRange.moveToElementText(el);
			textRange.collapse(true);
			textRange.moveEnd("character", end);
			textRange.moveStart("character", start);
			textRange.select();
		}
	}

	/**
	 * 팝업 열기
	 * @param {String} url 			- 팝업 URL
	 * @param {Number} width 		- 팝업 Width
	 * @param {Number} height 		- 팝업 Height
	 */
	_this.openPopup = function(url, popupName, width, height) {
		var posX = (screen.availWidth - width) / 2;
		var posY = (screen.availHeight - height) / 2;
		var check = window.open(url, popupName,'width=' + width + ', height=' + height + ', left=' + posX + ', top=' + posY +', location=no, staus=no');
		//창이 열려 있는지 check
		if(check){
			check.focus(); 
		} else {
			window.open(url, popupName,'width=' + width + ', height=' + height + ', left=' + posX + ', top=' + posY +', location=no, staus=no');
		}
	};

	/**
	 * Ajax 에러처리
	 */
	_this.ajaxError = function(url, parm) {
		var f = document.createElement('form');
		parm._csrf = '$!csrf_token';
		var objs, value;
		for (var key in parm) {
			value = parm[key];
			objs = document.createElement('input');
			objs.setAttribute('type', 'hidden');
			objs.setAttribute('name', key);
			if(key == 'boardSn') {
				if(isNaN(value)){
					value = 0;
				}
			}
			if(key == 'commentSn') {
				if(isNaN(value)){
					value = 0;
				}
			}
			objs.setAttribute('value', value);
			f.appendChild(objs);
		}
		f.setAttribute('method', 'GET');
		f.setAttribute('action', url);
		document.body.appendChild(f);
		f.submit();
	};

	/** 
	* string String::cutByte(int len)
	* 글자를 앞에서부터 원하는 바이트만큼 잘라 리턴합니다.
	* 한글의 경우 2바이트로 계산하며, 글자 중간에서 잘리지 않습니다.
	*/
	_this.cutByte = function(str, len) {
		var count = 0;
		for(var i = 0; i < str.length; i++) {
			if(escape(str.charAt(i)).length >= 4)
				count += 2;
			else
				if(escape(str.charAt(i)) != "%0D")
					count++;
			if(count >  len) {
				if(escape(str.charAt(i)) == "%0A")
					i--;
				break;
			}
		}
		return str.substring(0, i);
	}

	/**
	 * 글자수 제한 체크
	 */
	_this.lengthCheck = function(str, num) {
		var isVaild = true;
		if(str.length <= num) {
			isVaild = false;
		}
		return isVaild;
	}
	
	/**
	 * 문자열의 개시물 byte를 체크.
	 */
	_this.byteCheck = function(str, byte) {
		var count = 0;
		for(var i = 0; i < str.length; i++) {
			if(escape(str.charAt(i)).length >= 4){
				count += 2;
			} else{
				count++;
			}
		}
		if(byte < count){
			return false;
		}
		return true;
	}

	/**
	 * 문자열 공백 제거
	 */
	_this.deleteSpace = function(str) {
		return str.replace(/\s/gi, "");
	}
}
var util = new Util();