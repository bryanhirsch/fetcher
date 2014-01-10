var simpleTwitterFetcher = function() {

  var id, limit, data = [];
  
  return {
    /**
     * This method fetches data using JSONP. 
     *
     * It creates a script tag pointing at Twitter's CDN. Twitter responds by
     * calling response our custom "callback" function and passing it the HTML
     * used to populate Twitter's embeddable timeline, which we will parse.
     *
     * @param int widgetId
     *
     * @param int number
     *   Number of tweets to be returned. 0 for "as many as possible".
     */
    fetch: function(widgetId, number) {
      id = widgetId;
      limit = (typeof number === "number") ? number : 0;
      var c =  document.createElement("script");
      c.type = "text/javascript";
      c.src = "//cdn.syndication.twimg.com/widgets/timelines/" + id + "?&lang=en&callback=simpleTwitterFetcher.callback&suppress_response_codes=true&rnd=" + Math.random(); 
      document.getElementsByTagName("head")[0].appendChild(c);
    },

    /**
     * Retreive tweet data stored in simpleTwitterFetcher.data.
     */
    retreive: function() {
      return data;
    },

    /**
     * This is the callback invoked by fetch (really, called by Twitter's JSONP's
     * response). It stores the latest Twitter timeline data in
     * simpleTwitterFetcher.data.
     *
     * @param html e 
     *   JSON including rendered markup for an embeddable Twitter timeline
     */
    callback: function(e) {
      var result = [];

      // Get tweets passed in from call to Twitter via fetch method.
      xhrDoc = document.implementation.createHTMLDocument("XHR Doc");
      xhrDoc.documentElement.innerHTML = e.body;
      var tweets = xhrDoc.getElementsByClassName("tweet");

      // Parse tweets.
      var max = (limit > 0) ? limit : tweets.length;
      for (i = 0; i < max; i++) {
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

      // Store results only if newer data comes in.
      if (result.length > data.length) {
        data = result;
        if (typeof(jQuery) != 'undefined') {
          jQuery.event.trigger('simpleTwitterFetcherUpdatedData', [data]);
        }
      }
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
      var element = element.getElementsByClassName("retweet-credit")[0];
      return typeof(element) != 'undefined' ? element.outerHTML : null;
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
      return typeof(media) != 'undefined' ? media : null;
    },

    /**
     * @param HTML element
     * @return int
     */
    _getStatsRetweets: function(element) {
      var element = element.getElementsByClassName("stats-retweets")[0];
      return typeof(element) != 'undefined' ? element.getElementsByTagName("strong")[0].innerHTML : null;
    },

    /**
     * @param HTML element
     * @return int
     */
    _getStatsFavorites: function(element) {
      var element = element.getElementsByClassName("stats-favorites")[0];
      return typeof(element) != 'undefined' ? element.getElementsByTagName("strong")[0].innerHTML : null;
    },
  } // End return.

}();
