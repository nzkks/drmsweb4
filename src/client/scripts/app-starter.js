// global window */
import $ from 'jquery';


window.jQuery = $; // bootstrap needs this
require('bootstrap-sass');

class App {
  constructor(options) {
    this.initialize(options);
  }

  initialize() {
    this.title = 'Drmsweb4';
  }


  launch() {
    return this.amendPage()
    .then(() => {
      return this.start();
    });
  }

  start() {
    return this.instrumentPage();
  }

  amendPage() {
    // things to be done on first page load

    return Promise.resolve();
  }

  instrumentPage() {
    // things to be done after page contents has been modified
    return Promise.resolve();
  }

}


export default function() {
  const app = new App();
  return app.launch()
  .then(() => app);
}
