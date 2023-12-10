import { routes } from "./routes.js";
$(window).bind('popstate', router);

$(document).ready(function () {
  preventDefaultLinksBehaviour();
  router();
});

function navigateTo(url) {
  history.pushState(null, null, url);
  router();
}

function pathToRegex(path) {
  return new RegExp(
    '^' +
      path
        .replace(/\//g, '\\/')
        .replace(':page', '([1-9]+[0-9]*)')
        .replace(':postId', '([0-9a-f-]+)')
        .replace(':communityId', '([0-9a-f-]+)')  +
      '$',
  );
}

function getParams(match) {
  const values = match.resultMatch.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map((result) => result[1]);

  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[i]];
    }),
  );
}

async function router() {
  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      resultMatch: location.pathname.match(pathToRegex(route.path)),
    };
  });

  let match = potentialMatches.find((potentialMatch) => potentialMatch.resultMatch != null);

  if (!match) {
    match = {
      route: routes[0],
      resultMatch: routes[0].path.match(pathToRegex(routes[0].path)),
    };
  }

  let view = new match.route.view(getParams(match));
  let html = await view.getHtml();
  $('main').html(html);
  view.start();
}

function preventDefaultLinksBehaviour() {
$('body').click((e) => {
        if ($(e.target).is('[data-link]')) {
          e.preventDefault();
          navigateTo($(e.target).attr('href'));
        }

    if ($(e.target).hasClass('nav-link')) {
      $('.nav-link').removeClass('active');
      $(e.target).addClass('active');
    }
  });
}