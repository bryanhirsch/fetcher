var simpleTwitterFetcher = function(id) {
  return {
    fetch: function(id) {
      var c =  document.createElement("script");
      c.type = "text/javascript";
      c.src = "http://cdn.syndication.twimg.com/widgets/timelines/" + id + "?&lang=en&callback=simpleTwitterFetcher.callback&suppress_response_codes=true&rnd=" + Math.random(); 
      c.data-test = 'testing 1  2 3';
      document.getElementsByTagName("head")[0].appendChild(c);
    },

    callback: function(e) {
      var result = [];

      xhrDoc = document.implementation.createHTMLDocument("XHR Doc");
      xhrDoc.documentElement.innerHTML = e.body;

      var tweets = xhrDoc.getElementsByClassName("tweet");
      for (i = 0; i < tweets.length; i++) {
        var tweet = {
          id:                this._getId(tweets[i]),
          permalink:         this._getPermalink(tweets[i]),
          time:              this._getTime(tweets[i]),
          author:            this._getAuthor(tweets[i]),
          contentHTML:       this._getTweetContentHTML(tweets[i]),
          retweetCreditHTML: this._getRetweetCreditHTML(tweets[i]),
          media:             this._getMedia(tweets[i]),
          // TODO add detail-expander stuff here. (This is Twitter Card info).
          statsRetweets:     this._getStatsRetweets(tweets[i]),
          statsFavorites:    this._getStatsFavorites(tweets[i]),
          retweetUrl:        this._getActionUrl(tweets[i], 'retweet'),
          replyUrl:          this._getActionUrl(tweets[i], 'reply'),
          favoriteUrl:       this._getActionUrl(tweets[i], 'favorite')
        };
        result.push(tweet);
      }
      console.log(result);
      return result;
    },

    /**
     * @param HTML element
     * @return int
     */
    _getId: function(element) {
      return element.getAttribute("data-tweet-id");  
    },

    /**
     * @param element HTML element
     * @param action string
     * @return string
     */
    _getActionUrl: function(element, action) {
      var id = this._getId(element);
      if (action == 'retweet') {
        var url = 'https://twitter.com/intent/tweet/in_reply_to=' + id;
      }
      else {
        var url = 'https://twitter.com/intent/' + action + '?tweet_id=' + id;
      }
      return url;
    },

    /**
     * @param HTML element
     * @return string
     */
    _getPermalink: function(element) {
      var permalink = element.getElementsByClassName("permalink")[0];
      return permalink.href;
    },

    /**
     * @param HTML element
     * @return obj
     */
    _getTime: function(element) {
      var timeElement = element.getElementsByTagName("time")[0];
      var time = {
        datetime: timeElement.getAttribute("datetime"),
        title:    timeElement.getAttribute("title"),
        label:    timeElement.getAttribute("aria-label"),
      };
      return time;
    },

    /**
     * @param HTML element
     * @return obj
     */
    _getAuthor: function(element) {
      var authorElement = element.getElementsByClassName("p-author")[0];
      var author = {
        profileUrl: authorElement.getElementsByTagName("a")[0].getAttribute("href"),
        label:      authorElement.getElementsByTagName("a")[0].getAttribute("aria-label"),
        avatar:     authorElement.getElementsByTagName("img")[0].getAttribute("src"),
        avatar2x:   authorElement.getElementsByTagName("img")[0].getAttribute("data-src-2x"),
        fullName:   authorElement.getElementsByClassName("p-name")[0].innerHTML,
        userName:   authorElement.getElementsByClassName('p-nickname')[0].getElementsByTagName("b")[0].innerHTML,
      };
      return author
    },

    /**
     * @param HTML element
     * @return obj
     */
    _getTweetContentHTML: function(element) {
      return element.getElementsByClassName("e-entry-title")[0].outerHTML;
    },

    /**
     * @param HTML element
     * @return obj
     */
    _getRetweetCreditHTML: function(element) {
      return element.getElementsByClassName("retweet-credit")[0].outerHTML;
    },

    /**
     * @param HTML element
     * @return obj
     */
    _getMedia: function(element) {
      // NOTE: This assumes there's not more than ONE piece of inline media content per tweet.
      //  It this assumption is wrong, this logic should be updated to return an array of media
      //  objects, rather than a single one.
      var mediaElement = element.getElementsByClassName("inline-media")[0];
      if (typeof(mediaElement) != 'undefined') {
        var media = {
          linkTo:      mediaElement.getElementsByTagName("a")[0].getAttribute("href"),
          imageSource: mediaElement.getElementsByTagName("img")[0].getAttribute("src"),
          imageTitle:  mediaElement.getElementsByTagName("img")[0].getAttribute("title"), 
          imageAlt:    mediaElement.getElementsByTagName("img")[0].getAttribute("alt"),
          imageWidth:  mediaElement.getElementsByTagName("img")[0].getAttribute("width"),
          imageHeight: mediaElement.getElementsByTagName("img")[0].getAttribute("height")
        };
      }
      return typeof(media != 'undefined') ? media : null;
    },

    /**
     * @param HTML element
     * @return int
     */
    _getStatsRetweets: function(element) {
      return element.getElementsByClassName("stats-retweets")[0].getElementsByTagName("strong")[0].innerHTML;
    },

    /**
     * @param HTML element
     * @return int
     */
    _getStatsFavorites: function(element) {
      return element.getElementsByClassName("stats-favorites")[0].getElementsByTagName("strong")[0].innerHTML;
    },

  }
}();
