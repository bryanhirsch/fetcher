/*********************************************************************
*  #### Twitter Post Fetcher v10.0 ####
*  Coded by Jason Mayes 2013. A present to all the developers out there.
*  www.jasonmayes.com
*  Please keep this disclaimer with my code if you use it. Thanks. :-)
*  Got feedback or questions, ask here: 
*  http://www.jasonmayes.com/projects/twitterApi/
*  Updates will be posted to this site.
*********************************************************************/
var twitterFetcher = function () {
    function x(e) {
        return e.replace(/<b[^>]*>(.*?)<\/b>/gi, function (c, e) {
            return e
        }).replace(/class=".*?"|data-query-source=".*?"|dir=".*?"|rel=".*?"/gi, "")
    }

    function p(e, c) {
        for (var g = [], f = RegExp("(^| )" + c + "( |$)"), a = e.getElementsByTagName("*"), h = 0, d = a.length; h < d; h++) f.test(a[h].className) && g.push(a[h]);
        return g
    }
    var y = "",
        l = 20,
        s = !0,
        k = [],
        t = !1,
        q = !0,
        r = !0,
        u = null,
        v = !0,
        z = !0,
        w = null,
        A = !0;
    return {
        fetch: function (e, c, g, f, a, h, d, b, m, n) {
            void 0 === g && (g = 20);
            void 0 === f && (s = !0);
            void 0 === a && (a = !0);
            void 0 === h && (h = !0);
            void 0 === d && (d = "default");
            void 0 === b && (b = !0);
            void 0 === m && (m = null);
            void 0 === n && (n = !0);
            t ? k.push({
                id: e,
                domId: c,
                maxTweets: g,
                enableLinks: f,
                showUser: a,
                showTime: h,
                dateFunction: d,
                showRt: b,
                customCallback: m,
                showInteraction: n
            }) : (t = !0, y = c, l = g, s = f, r = a, q = h, z = b, u = d, w = m, A = n, c = document.createElement("script"), c.type = "text/javascript", c.src = "http://cdn.syndication.twimg.com/widgets/timelines/" + e + "?&lang=en&callback=twitterFetcher.callback2&suppress_response_codes=true&rnd=" + Math.random(), document.getElementsByTagName("head")[0].appendChild(c))
        },

        callback2: function (e) {
          // This is the result we're going to return to the consumer.
          // JSON tweet data.
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

        callback: function (e) {

          // DEBUGGING
          // console.log(e);
          xhrDoc = xhrDoc = document.implementation.createHTMLDocument("XHR Doc");
          xhrDoc.documentElement.innerHTML = e.body;
          var eContent = xhrDoc.getElementsByClassName("e-entry-content");
          // console.log(eContent);
          for (i = 0; i < eContent.length; i++) {
            var img = eContent[i].getElementsByTagName("img")[0];
            var title = (typeof(img) != 'undefined') ? img.getAttribute("title") : 'NA';
            if (title == 'View image on Twitter') {
              console.log(img.src);
            }
          }
          
            var c = document.createElement("div");
            c.innerHTML = e.body;
            "undefined" === typeof c.getElementsByClassName && (v = !1);
            e = [];
            var g = [],
                f = [],
                a = [],
                h = [],
                d = 0;
            if (v)
                for (c = c.getElementsByClassName("tweet"); d < c.length;) {
                    0 < c[d].getElementsByClassName("retweet-credit").length ? a.push(!0) : a.push(!1);
                    if (!a[d] || a[d] && z) e.push(c[d].getElementsByClassName("e-entry-title")[0]), h.push(c[d].getAttribute("data-tweet-id")), g.push(c[d].getElementsByClassName("p-author")[0]), f.push(c[d].getElementsByClassName("dt-updated")[0]);
                    d++
                } else
                    for (c = p(c, "tweet"); d < c.length;) e.push(p(c[d], "e-entry-title")[0]), h.push(c[d].getAttribute("data-tweet-id")), g.push(p(c[d], "p-author")[0]), f.push(p(c[d], "dt-updated")[0]), 0 < p(c[d], "retweet-credit").length ? a.push(!0) : a.push(!1), d++;
            e.length > l && (e.splice(l, e.length - l), g.splice(l, g.length - l), f.splice(l, f.length - l), a.splice(l, a.length - l));
            c = [];
            d = e.length;
            for (a = 0; a < d;) {
                if ("string" !== typeof u) {
                    var b = new Date(f[a].getAttribute("datetime").replace(/-/g, "/").replace("T", " ").split("+")[0]),
                        b = u(b);
                    f[a].setAttribute("aria-label", b);
                    if (e[a].innerText)
                        if (v) f[a].innerText = b;
                        else {
                            var m = document.createElement("p"),
                                n = document.createTextNode(b);
                            m.appendChild(n);
                            m.setAttribute("aria-label", b);
                            f[a] = m
                        } else f[a].textContent = b
                }
                b = "";
                s ? (r && (b += '<div class="user">' + x(g[a].innerHTML) + "</div>"), b += '<p class="tweet">' + x(e[a].innerHTML) + "</p>", q && (b += '<p class="timePosted">' + f[a].getAttribute("aria-label") + "</p>")) : e[a].innerText ? (r && (b += '<p class="user">' + g[a].innerText + "</p>"), b += '<p class="tweet">' + e[a].innerText +
                    "</p>", q && (b += '<p class="timePosted">' + f[a].innerText + "</p>")) : (r && (b += '<p class="user">' + g[a].textContent + "</p>"), b += '<p class="tweet">' + e[a].textContent + "</p>", q && (b += '<p class="timePosted">' + f[a].textContent + "</p>"));
                A && (b += '<p class="interact"><a href="https://twitter.com/intent/tweet?in_reply_to=' + h[a] + '" class="twitter_reply_icon">Reply</a><a href="https://twitter.com/intent/retweet?tweet_id=' + h[a] + '" class="twitter_retweet_icon">Retweet</a><a href="https://twitter.com/intent/favorite?tweet_id=' +
                    h[a] + '" class="twitter_fav_icon">Favorite</a></p>');
                c.push(b);
                a++
            }
            if (null == w) {
                e = c.length;
                g = 0;
                f = document.getElementById(y);
                for (h = "<ul>"; g < e;) h += "<li>" + c[g] + "</li>", g++;
                f.innerHTML = h + "</ul>"
            } else w(c);
            t = !1;
            0 < k.length && (twitterFetcher.fetch(k[0].id, k[0].domId, k[0].maxTweets, k[0].enableLinks, k[0].showUser, k[0].showTime, k[0].dateFunction, k[0].showRt, k[0].customCallback, k[0].showInteraction), k.splice(0, 1))
        }
    }
}();

/*
* ### HOW TO CREATE A VALID ID TO USE: ###
* Go to www.twitter.com and sign in as normal, go to your settings page.
* Go to "Widgets" on the left hand side.
* Create a new widget for what you need eg "user timeline" or "search" etc. 
* Feel free to check "exclude replies" if you dont want replies in results.
* Now go back to settings page, and then go back to widgets page, you should
* see the widget you just created. Click edit.
* Now look at the URL in your web browser, you will see a long number like this:
* 345735908357048478
* Use this as your ID below instead!
*/

/**
 * How to use fetch function:
 * @param {string} Your Twitter widget ID.
 * @param {string} The ID of the DOM element you want to write results to. 
 * @param {int} Optional - the maximum number of tweets you want returned. Must
 *     be a number between 1 and 20.
 * @param {boolean} Optional - set true if you want urls and hash
       tags to be hyperlinked!
 * @param {boolean} Optional - Set false if you dont want user photo /
 *     name for tweet to show.
 * @param {boolean} Optional - Set false if you dont want time of tweet
 *     to show.
 * @param {function/string} Optional - A function you can specify to format
 *     tweet date/time however you like. This function takes a JavaScript date
 *     as a parameter and returns a String representation of that date.
 *     Alternatively you may specify the string 'default' to leave it with
 *     Twitter's default renderings.
 * @param {boolean} Optional - Show retweets or not. Set false to not show.
 * @param {function/string} Optional - A function to call when data is ready. It
 *     also passes the data to this function should you wish to manipulate it
 *     yourself before outputting. If you specify this parameter you  must
 *     output data yourself!
 * @param {boolean} Optional - Show links for reply, retweet, favourite. Set false to not show.
 */

// ##### Simple example 1 #####
// A simple example to get my latest tweet and write to a HTML element with
// id "tweets". Also automatically hyperlinks URLS and user mentions and
// hashtags.
twitterFetcher.fetch('415143052894674946', 'example1', 1, true);


// ##### Simple example 2 #####
// A simple example to get my latest 5 of my favourite tweets and write to a HTML
// element with id "talk". Also automatically hyperlinks URLS and user mentions and
// hashtags but does not display time of post.
twitterFetcher.fetch('415143052894674946', 'example2', 5, true, true, false);


// ##### Advanced example #####
// An advance example to get latest 5 posts using hashtag #API and write to a
// HTML element with id "tweets2" without showing user details and using a
// custom format to display the date/time of the post, and does not show
// retweets.
twitterFetcher.fetch('415143052894674946', 'example3', 3, true, false, true, dateFormatter, false);

// For advanced example which allows you to customize how tweet time is
// formatted you simply define a function which takes a JavaScript date as a
// parameter and returns a string!
// See http://www.w3schools.com/jsref/jsref_obj_date.asp for properties
// of a Date object.
function dateFormatter(date) {
  return date.toTimeString();
}


// ##### Advanced example 2 #####
// Similar as previous, except this time we pass a custom function to render the
// tweets ourself! Useful if you need to know exactly when data has returned or
// if you need full control over the output.
twitterFetcher.fetch('415143052894674946', '', 3, true, true, true, '', false, handleTweets, false);

function handleTweets(tweets){
    var x = tweets.length;
    var n = 0;
    var element = document.getElementById('example4');
    var html = '<ul>';
    while(n < x) {
      html += '<li>' + tweets[n] + '</li>';
      n++;
    }
    html += '</ul>';
    element.innerHTML = html;
}
