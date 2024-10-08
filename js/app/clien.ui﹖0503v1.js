function UI() {
	var _this = this;

	// 게시글 & 댓글 신고 정보
	_this.singoActionReason = function(boardSn, commentSn) {
		var url = API_HOST + '/board/singo/reason';
		if(commentSn != ''){
			if(boardSn == '') {
				boardSn = $('#boardSn').val();
			}
			url = url + '?boardSn='+boardSn +'&commentSn='+commentSn;
		} else {
			url = url + '?boardSn='+boardSn;
		}
		$.ajax({
			url: url,
			type: 'GET',
			success: function (result) {
				var aReason = result.adminReason;
				var rDate = result.singoResultDate;

				if(aReason == null || aReason == 'null') {
					aReason = '-';
				}
				if(rDate == null || rDate == 'null') {
					rDate = '-';
				}

				if(commentSn != ''){
					$('#singoReason_'+commentSn).text(aReason);
					$('#singoDate_'+commentSn).text(rDate);
				} else {
					$('#singoReason_'+boardSn).text(aReason);
					$('#singoDate_'+boardSn).text(rDate);
				}
			},
			error: function (result) {
				console.log(result);
			}
		});
	};

	// 팁과강좌 이미지 배경칼라 램덤 변경
	_this.noImgBackgroundColor = function() {
		var colors = ['#E26A6A', '#BA68C8', '#5C97BF', '#4A654D', '#0D47A1', '#E47833', '#858E90', '#947CB0', '#B9AF30', '#FFA726', '#006064'];
		var boxes = document.querySelectorAll(".box");

		for (i = 0; i < boxes.length; i++) {
			boxes[i].style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
		}
	}

	// 목록 공감칼라 설정 함수
	_this.initSymphathy = function() {
		var lSymphColor;
		var tSymphColor;
		var cSymphColor;

		$('.symph_row').each(function(){
			var listSymph = parseInt($(this).find('.view_symph').text());
			if(listSymph <= 0){
				lSymphColor = "lSymph01";
			} else if(listSymph <= 1){
				lSymphColor = "lSymph02";
			} else if(listSymph <= 10){
				lSymphColor = "lSymph03";
			} else if(listSymph <= 50){
				lSymphColor = "lSymph04";
			} else if(listSymph <= 98){
				lSymphColor = "lSymph05";
			} else if(listSymph > 98){
				lSymphColor = "lSymph06";
				$(this).find('.view_symph > span').text('99+');
			}
			$(this).find('.view_symph').addClass(lSymphColor);
		});
	};

	/**
	 * 이벤트 바인드
	 */
	_this.eventBind = function() {
		// 드랍다운 Select box 한번에 보여주는 갯수 크기
		$('.select').selectpicker({
			size: 10
		});
		
		// 실명일치확인 이벤트 버블링 막음
		$('.name_same').on('click', function(e) {
			e.stopPropagation();
		});
		
		// 메모칼라 이벤트 버블링 막음 || 칼라선택 UI 출력
		$('.button_set').on('click', function(e) {
			$('.color_layer').toggleClass('open');
			$('.memo_box').toggleClass('open');
			e.stopPropagation();
		});
		$('.button_color').on('click', function(e) {
			e.stopPropagation();
		});
		
		// 토픽 UI 출력
		$("#keyword_set").on('click', function(e) {
			$("#topic_set").toggleClass('view');
			e.stopPropagation();
		});
		
		// 재검토 요청 내역 닫기
		$("#post_msg").on('click', function(e) {
			$(".admin_report").toggleClass('close');
		});
		
		$("#post_article").on('click', function(e) {
			$(".post_reexamine_article").toggleClass('close');
		});
		
		$("#post_comment").on('click', function(e) {
			$(".post_reexamine_comment").toggleClass('close');
		});

		// hide #back-top first : 액션버튼 맨위로 버튼 동작
		$("#back-top").hide();
		$(function () {// fade in #back-top
			$(window).scroll(function () {
				if ($(this).scrollTop() > 148) {
					$('#back-top').fadeIn();
				} else {
					$('#back-top').fadeOut();
				}
			});
		});
		// END

		// 게시판 선택영역 외 다른부분 클릭시 창 닫기 버튼
		$('body').click(function(e){
			var $clickable = $('*[data-role=dropdown-write-article]');
			if (!$clickable.is(e.target) && $clickable.has(e.target).length === 0 && $('.open').has(e.target).length === 0) {
				$clickable.removeClass('open');
			}
		});

		// 글쓰기 버튼 클릭 Start
		$('*[data-role=dropdown-write-article] a').on('click', function (event) {
			if (typeof app.env.isBoardGroupPage == 'boolean' && app.env.isBoardGroupPage) {
				$(this).parent().toggleClass('open');
			} else {
				var url = BASE_URL + '/board/regist?boardCd=' + app.env.boardCd;
				location.href = url;
			}
		});
		// 그룹페이지에서 글쓰기 이동은 최종적으로 이 함수를 통해서 이동
		_this.moveWriteGroupPage = function(boardCd) {
			var url = BASE_URL + '/board/regist?boardCd=' + boardCd;
			location.href=url;
		};
		// 글쓰기 버튼 클릭 End

		// LIST MEMO 보이기 옵션 설정
		$('.memo-view').click(function(){
			$('.memo-view').toggleClass('active');
			storage.updateMemoViewSetting();
			location.reload();
		});
		$('.memo-sync').click(function(){
			storage.storageUpdate();
			location.reload();
		});
		$('.keyword-sync').click(function(){
			keyWord.updateKeword();
			location.reload();
		});
		// 운영현황 리포트 열기
		$('.button_chart').click(function(){
			$('.button_chart').toggleClass('active');
			$('.report_chart').toggleClass('open');
		});
		// 회원가입약관 열기
		$('.form_open').click(function(){
			$('.form_terms').toggleClass('open');
			$('.form_open').toggleClass('close');
		});

		// Timestamp | IP, Time 마우스 오버시 상세 정보 출력
		$(document).on('mouseover', '.popover', function() {
			$(this).children('span').show();
		}).on('mouseout', '.popover', function() {
			$(this).children('span').hide();
		});

		// Signature Expansion | 서명창 확장 버튼
		$('.signature .button-expand').click(function(){
			$('.signature').toggleClass('expanded');
		});

		// 신고하기 팝업 버튼 클릭시 selected 되도록 하는 기능. -> 신고 팝업 함수로 옴겨야 한다.
		$('.content_reason .button_reason').bind('click',function(){
			$(this).addClass('selected').siblings().removeClass('selected');
		});

		// 팝업에서 사용 | Scrap, Memo 글 Input창 입력시, Ui컨트롤 START
		$('.note-region .note-input').on('focus',function(){
			$('.note-region').addClass('open');
			$('.modal-bg').addClass('open');
		});
		$('.modal-bg').click(function(){
			$('.modal-bg').removeClass('open');
			$('.note-region').removeClass('open');
		});
		$('.note-region .dropdown-menu li').click(function(){
			var prevText = $(this).text();
			$('.note-input').val(prevText);
			$('.note-region').removeClass('open');
			$('.modal-bg').removeClass('open');
		});
		// END
		
		// 로그인 아이디 패스워드 입력 시 자동로그인 창 열림 START
		$('body').click(function(e){
			var $clickable = $('*[data-role=account-open]');
			if (!$clickable.is(e.target) && $clickable.has(e.target).length === 0 && $('.open').has(e.target).length === 0) {
				$clickable.removeClass('open');
			}
		});
		$('.side_logout').click(function(){
			$('.nav_header').addClass('open');
		});
		$('.search_input').click(function(){
			$('.nav_header').removeClass('open');
		});
		// END

		// 메뉴 소모임 전체보기
		$('#more').click(function(){
			$('.menu_somoim').toggleClass('open');
			$('.button_more').toggleClass('open')
		});
		// 지금 필요 없음
//		$('#nav-more').click(function(){
//			$('.navmenu').toggleClass('open');
//			$('.button_more_nav').toggleClass('open')
//		});
		// END

		// 플로라 에디어 버그 | 에디터 비디오 수정 시 &nbsp; 발생 제거 (플로라 버전 업데이트시 계속 확인 할 것)
		$('p span.fr-video').each(function(){
			$(this).html($(this).html().replace(/&nbsp;/gi,''));
		});
	};

	/**
	 * 메뉴 단축키 이동
	 */
	var shortCutIsVaild = false;
	setTimeout(function() {
		shortCutIsVaild = true;
	}, 700);

	_this.initShortCut = function() {
		var data = localStorage.getItem('PAGE_SETTING');
		data = JSON.parse(data);

		if(PAGE_SETTING_SHORT_CUT == 'on'){

			var ua = window.navigator.userAgent;
			var msie = ua.indexOf('MSIE ');
			var trident = ua.indexOf('Trident/');
			var edge = ua.indexOf('Edge/');

			// Internet Explorer or Edge
			if (msie > 0 || trident > 0 || edge > 0) {
				$(document).on('keyup', function(e) {
					_this.moveShortCut(e);
				});
			} else { // Etc Browser
				$(document).on('keydown', function(e) {
					var repeat = event.repeat;
					if(!repeat) {
						_this.moveShortCut(e);
					}
				});
			}
		}
	};

	_this.moveShortCut = function(e) {
		
		if(shortCutIsVaild){
			var tagName = e.target.nodeName;
			var po = $('#po').val();
	
			if ( (tagName != 'INPUT') && (tagName != 'TEXTAREA') && (tagName != 'SELECT' ) && (e.target.className.indexOf('fr-view') == -1) && (e.target.className.indexOf('comment-textarea') == -1)) {
	
				if (e.ctrlKey) return;
				if (e.shiftKey) return;
				if (e.altKey) return;
				if (e.metaKey) return;
				
				var pressedKey = e.key.toLowerCase();
				// 새댓글 확인
				if (pressedKey == 'r') {
					if ($('*[data-role=comment-newest]').length) {
						$('*[data-role=comment-newest] button').trigger('click');
					}
				} else if (pressedKey == ',') { // 게시물 본문 이전글 링크
					var preListType = $('#preListType').val();
					if(preListType == 'recommend') {
						return false;
					} else if(preListType == 'recent') {
						return false;
					}
					
					var pageName = $('#pageName').val();
					if(pageName == 'boardView'){
						list.neiborArticle('prev');
					} else {
						var searchIsVaild = $('#searchIsVaild').val();
						var prevPo = ((po)*1 -1);
						
						if(prevPo < 0) {
							prevPo = 0;
						}
						
						if(searchIsVaild == 'true') {
							paging.getSearchBoard('direct', prevPo);
						} else {
							paging.getBoard('direct', prevPo);
						}
					}
				} else if (pressedKey == '.') { // 게시물 본문 다음글 링크
					var preListType = $('#preListType').val();
					if(preListType == 'recommend') {
						return false;
					} else if(preListType == 'recent') {
						return false;
					}
					
					var pageName = $('#pageName').val();
					if (pageName == 'boardView') {
						list.neiborArticle('next');
					} else {
						var searchIsVaild = $('#searchIsVaild').val();
						var nextPo = ((po)*1 +1);
						
						if(searchIsVaild == 'true') {
							paging.getSearchBoard('direct', nextPo);
						} else {
							paging.getBoard('direct', nextPo);
						}
					}
				} else { // 기타 메뉴
					$.each(keyData, function(key, val) {
						if (key == pressedKey) {
							window.location.href = val;
						}
					});
				}
			}
		}
	};
	
	_this.initSmallShortCut = function() {
		var data = localStorage.getItem('PAGE_SETTING');
		data = JSON.parse(data);
		if(PAGE_SETTING_SHORT_CUT == 'on'){
			$(document).on('keydown', function(e) {
				if(shortCutIsVaild){
					var tagName = e.target.nodeName;
					if ( (tagName != 'INPUT') && (tagName != 'TEXTAREA') && (tagName != 'SELECT' ) && (e.target.className.indexOf('fr-view') == -1) && (e.target.className.indexOf('comment-textarea') == -1)) {
						if (e.ctrlKey) return;
						if (e.shiftKey) return;
						if (e.altKey) return;

						if (e.metaKey) return;
						var pressedKey = e.key.toLowerCase();

						$.each(keyData, function(key, val) {
							if (key == pressedKey) {
								window.location.href = val;
							}
						});
					}
				}
			});
		}
	};

	/**
	 * 나의메뉴 즐겨찾기 별 표시 관련 함수
	 */
	_this.initBookmakerStarDisplay = function() {
		if (IS_LOGIN) {
			var boardCd = $('#boardCd').val();
			var groupCd = $('#groupCd').val();

			if(boardCd == ""){
				boardCd = "NoBoardCd";
			}
			if(groupCd == ""){
				groupCd = "NoGroupCd";
			}

			var data = storage.storageGetBookmaker();
			if ($.isArray(data)) {
				$.each(data, function(i, v) {
					if(v.boardCd == boardCd){
						$('.board-bookmark').addClass('active');
						$('#bookmarkShortcutSup').text(v.shortcut);
					}
					if(v.groupCd == groupCd){
						$('.board-bookmark').addClass('active');
						$('#bookmarkShortcutSup').text(v.shortcut);
					}
				});
			}
		}
	}

	var saveBookmarkIsVaild = true;
	_this.saveBookMark = function() {
		if(saveBookmarkIsVaild){
			saveBookmarkIsVaild = false;
			if($('.board-bookmark').hasClass('active') === false){
				if (IS_LOGIN) {
					var data = storage.storageGetBookmaker();
					if(data == null) {
						data = [];
					}
					var num = 0;
					var empityNum = [0,1,2,3,4,5,6,7,8,9];
					if ($.isArray(data)) {
						$.each(data, function(i, v) {
							num++;
							empityNum = $.grep(empityNum, function(value){
								return value != v.seq;
							});
						});
					}
					if(num >= 10){
						if(confirm("나의 메뉴는 10개까지 등록 가능 합니다.\n메뉴를 수정 하시겠습니까?")){
							popup.myBookmaketPopup();
						}
					} else {
						var boardCd = $('#boardCd').val();
						var groupCd = $('#groupCd').val();
						var title = $('#boardName').val();
						var shortcut = 0;
						shortcut = Math.min.apply(null, empityNum) + 1;
						if(shortcut == 10){
							shortcut = 0;
						}
						data.push({
							seq : Math.min.apply(null, empityNum),
							title: title,
							shortcut: shortcut,
							boardCd: boardCd,
							groupCd: groupCd
						});

						data.sort(function(a, b){
							return a.seq < b.seq ? -1 : a.seq > b.seq ? 1:0;
						});

						var url = API_HOST + '/myBookMarkPreference';
						var params = data;

						$.ajax({
							url: url,
							type: 'POST',
							data: {
								param: JSON.stringify(params)
							},
							success: function(result) {
								storage.storageUpdateBookmaker(data);
								$('#bookmarkSaveTooltip').css('visibility', 'visible');
								$('#bookmarkShortCut').text(shortcut);
								setTimeout(function(){
									location.reload();
									saveBookmarkIsVaild = true;
								}, 700);
							},
							error: function(result) {
								console.log("BookMakrERROR");
							}
						});
					}
				}
			} else {
				var data = storage.storageGetBookmaker();
				var boardCd = $('#boardCd').val();

				data = $.grep(data, function(value){
					return value.boardCd != boardCd;
				});

				var url = API_HOST + '/myBookMarkPreference';
				var params = data;

				$.ajax({
					url: url,
					type: 'POST',
					data: {
						param: JSON.stringify(params)
					},
					success: function(result) {
						storage.storageUpdateBookmaker(data);
						$('#bookmarkDeleteTooltip').css('visibility', 'visible');
						setTimeout(function(){
							location.reload();
							saveBookmarkIsVaild = true;
							
						}, 700);
					},
					error: function(result) {
						util.log(result);
					}
				});
			}
		}
	}

	// 게시물 차단
	_this.initBlockArticle = function() {

		var blockCount = 0;
		var blockList = "";
		var highlightList = "";
		var keywordIsVaild = false;

		// MEMO DATA
		var memoListJSON = localStorage.getItem('MY_MEMO_LIST');
		var jsonInfo = JSON.parse(memoListJSON);
		var memoView_yn = localStorage.getItem('MEMO_LIST_VIEW_YN');

		// KEY WORLD DATA
		var keywordJSON = localStorage.getItem('KEYWORD');
		var keyword = JSON.parse(keywordJSON);

		if(keywordJSON != null) {
			blockList = keyword.blockKeyWord.split(',');
			highlightList = keyword.highlightKeyWord.split(',');
			keywordIsVaild = true;
		}

		// OBSERVE LIST DATA
		var observeListInfo = localStorage.getItem('OBSERVELIST_'+sessionUserId);
		var observeList = JSON.parse(observeListInfo);

		// RECENT LIST DATA
		var recentIsVaild = localStorage.getItem('MY_VIEW_LIST_ISVAILD');

		// ARTICLE LIST START
		$('*[data-role=list-row]').each(function() {
			var row = $(this);
			var listBoardSn = row.data('board-sn'); // 해당글 BoardSn 번호
			var listCommentCount = row.data('comment-count'); // 해당글 댓글 갯수
			var authorId = row.data('author-id'); // 해당글 작성자

			// 최근글 댓글변화 보여주기
			if(recentIsVaild != 'N') {
				var recentInfo = localStorage.getItem('MY_VIEW_LIST');
				var recentList = JSON.parse(recentInfo);

				for(var r in recentList) {
					var recentBoardSn = recentList[r].boardSn;
					var recentCmCount = recentList[r].commentCount;

					if (listBoardSn == recentBoardSn) {
						if(listCommentCount != recentCmCount) {
							var difference = (listCommentCount*1) - (recentCmCount*1);
							if(difference > 0){
								difference = "(+" + difference + ")";
							} else {
								difference = "(" + difference + ")";
							}
							row.find('*[data-role=recentCmCount]').text(difference);
						}
					}
				}
			}

			// 메모 보여주기 START
			if (IS_LOGIN) {
				for(var i in jsonInfo.memoList) {
					var destId = jsonInfo.memoList[i].destId;
					var blockArticleYn = jsonInfo.memoList[i].blockArticleYn;
					var memo = jsonInfo.memoList[i].note;
					var color = jsonInfo.memoList[i].color;
					var colorCss = "mColor01";

					if(color == "2") {
						colorCss = "mColor02";
					} else if (color == "3") {
						colorCss = "mColor03";
					} else if (color == "4") {
						colorCss = "mColor04";
					} else if (color == "5") {
						colorCss = "mColor05";
					}

					if (destId == authorId && blockArticleYn) {
						// 목록에서 삭제함.
						row.remove();
						blockCount += 1;
					}
	
					if(memoView_yn == "true"){
						if (destId == authorId) {
							// 목록에서 메모 보여주기
							row.find('*[data-role=list_memo]').addClass(colorCss).removeClass('none').text(memo);
							row.addClass('short');
						}
					}
				}
			}

			// 키워드 차단
			if(IS_LOGIN && keywordIsVaild){
				if(keyword.blockKeyWord != "" && keyword.keywordYn) {
					$.each(blockList, function(index, element) {
						if(element != "") {
							if((row.find('*[data-role=list-title-text]').text()).match(element)) {
								row.remove();
								blockCount += 1;
							}
						}
					});
				}
			}

			// 주시된 글 표시
			if (IS_LOGIN) {
				var listButtonActive = false;

				for(var k in observeList) {
					var boardSn = observeList[k].boardSn;
					var cmCount = observeList[k].cmCount;
					if(listBoardSn == boardSn) {
						row.addClass('stare');
						row.find('*[data-role=observeIcon]').show();

						if(listCommentCount != cmCount){
							var difference = (listCommentCount*1) - (cmCount*1);

							if(difference > 0){
								difference = "(+" + difference + ")";
							} else {
								difference = "(" + difference + ")";
							}
							row.find('*[data-role=observeCmCount]').text(difference);
						}
					}
					listButtonActive = true;
				}
				if(listButtonActive){
					$('#listObserveButton').addClass('active');
				}
			}
		});
		// ARTICLE LIST END

		// 강조 키워드 강조
		if(IS_LOGIN && keywordIsVaild){
			if(keyword.highlightKeyWord != "" && keyword.keywordYn) {
				$('*[data-role=list-title-text]').each(function() {
					var row = $(this);
					// Highlight
					$.each(highlightList, function(index, element) {
						$(row).mark(element);
					});
				});
			}
		}

		// 몇개의 개시물이 삭제되었는지 표시. 0개 이상일 경우에만.
		if(blockCount > 0) {
			$('#blockCountSpan').show();
			$('#blockCount').text(blockCount);
		}
	};

	/**
	 * Init
	 */
	_this.init = function() {
		$(function(){
			if (window.app == undefined) {
				window.app = function() {
					this.env = {};
				};
			}
			_this.eventBind();
			_this.noImgBackgroundColor();
		});
	}();
}

var ui = new UI();