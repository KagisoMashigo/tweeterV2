// This is responsible for toggling the form using the arrow on the page
const toggleForm = () => {
  const $arrow = $('#togglearrow');
  $arrow.on('click', function() {
    const $newTweet = $('.tweet-form');
    if ($newTweet.is(":visible")) {
      $newTweet.slideUp(750);
    } else {
      $newTweet.slideDown(750);
    }
  });
};

// Creates tweet by injecting html article into container on page
const createTweetElement = function(tweet) {
  let $tweet = `
  <article id="tweet">
    <header class="tweet-header"> 
      <img src="${escape(tweet.user.avatars)}">
      <h2 class="username">${escape(tweet.user.name)}</h2>
      <span class="handle">${escape(tweet.user.handle)}</span>
    </header>
    <section>
      <p>${escape(tweet.content.text)}</p>
    </section>
    <footer class="tweet-footer">
      <p2>${moment(tweet.created_at).fromNow()}</p2>
      <span>
      <i class="fab fa-facebook-square"></i>
      </span>
    </footer>
  </article>`;
  return $tweet;
};

// Renders tweets that it receives from createTweetElement
const renderTweets = function(tweets) {
  $('.tweet-body').empty();
  for (const tweet of tweets) {
    const value = createTweetElement(tweet);
    $('.tweet-body').prepend(value);
  }
};

// Posts tweets using AJAX
const postTweets = () => {
  $(".tweet-form").submit(function(event) {
    event.preventDefault();
    if ($('.textarea').val().length >= 140) {
      checkSectionErrors('.errors', `<strong>⚠️ You've got too much character, friend. Reduce your character count ⚠️</strong>`, 2500, 'slow');
    } else if ($('.textarea').val().length === 0) {
      checkSectionErrors('.errors', `<strong>⚠️ You could use some more character. Add to your character count ⚠️</strong>`, 2500, 'slow');
    } else {
      $.ajax({
        url: "/tweets",
        method: "POST",
        data: $(this).serialize()
      }).then(() => {
        $('.tweet-form').children('textarea').val('');
        loadTweets();
      }).catch(err => console.log(err));
    }
  });
};

// Loads tweets using AJAX
const loadTweets = () => {
  $.ajax({
    url: "/tweets",
    method: "GET",
    data: "data"
  }).then((data) => {
    renderTweets(data);
  }).catch(err => console.log(err));
};

// Function used to ensure scripts cannot be run by users
const escape =  function(string) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(string));
  return div.innerHTML;
};

// Function made to check errors on form submission
const checkSectionErrors = (section, errMsgHtml, delay, slideSpeed) => {
  $(section).empty();
  const output = $(section).append(errMsgHtml).slideDown(slideSpeed).delay(delay).slideUp(slideSpeed);
  return output;
};

// Document ready ensures all functions will only be called once the page has loaded
$(document).ready(() => {
  postTweets();
  loadTweets();
  toggleForm();
});
