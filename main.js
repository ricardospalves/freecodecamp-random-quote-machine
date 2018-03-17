(function (win, doc) {
	'use strict';

	const quoteMachine = function () {
		const $quoteBoxText = doc.querySelector('[data-js="quoteBox__text"]');
		const $quoteBoxFooter = doc.querySelector('[data-js="quoteBox__footer"]');
		const $quoteBoxTweet = doc.querySelector('[data-js="quoteBox__tweet"]');
		const $quoteBoxAuthor = doc.querySelector('[data-js="quoteBox__author"]');
		const $quoteTweet = doc.querySelector('[data-js="quoteBox__tweet"]');
		const $quoteNew = doc.querySelector('[data-js="quoteBox__new"]');
		const ajax = new XMLHttpRequest();

		ajax.open('GET', 'https://talaikis.com/api/quotes/random/');
		ajax.send();

		return {
			init: function init() {
				quoteMachine.quote();
			},

			quote: function quote() {
				quoteMachine.eventsListeners();
			},

			eventsListeners: function eventsListeners() {
				ajax.onreadystatechange = quoteMachine.handleReadyStateChange;
				$quoteNew.addEventListener('click', quoteMachine.handleClickQuoteNew, false);
			},

			handleReadyStateChange: function handleReadyStateChange() {
				if (quoteMachine.isRequestOk()) {
					quoteMachine.fillQuote();
					quoteMachine.setBtnTweetURL();
				}
			},

			handleClickQuoteNew: function handleClickQuoteNew() {
				location.reload();
			},

			isRequestOk: function isRequestOk() {
				return ajax.readyState === 4 && ajax.status === 200;
			},

			fillQuote: function fillQuote() {
				const data = quoteMachine.ajaxData();

				$quoteBoxText.textContent = data.quote;
				$quoteBoxAuthor.textContent = data.author;
			},

			setBtnTweetURL: function setBtnTweetURL() {
				$quoteTweet.href = quoteMachine.tweetURL();
			},

			tweetURL: function tweetURL() {
				const limitTweetCharacters = 280;
				const data = quoteMachine.ajaxData();
				const quote = data.quote;
				const author = data.author;
				const paramText = '"' + quote + '" \u2014 ' + author;
				const rest = paramText.length - limitTweetCharacters;
				const ellipsis = '…';
				const url = 'https://twitter.com/intent/tweet?text=';

				if (rest > 0) {
					paramText = paramText.replace(/".+?"/, function (match) {
						return match.slice(0, -(rest + 2 + ellipsis.length)) + ellipsis + "\"";
					});
				}

				return url + paramText;
			},

			ajaxData: function ajaxData() {
				return JSON.parse(ajax.responseText);
			}
		};
	}();

	quoteMachine.init();
})(window, document);