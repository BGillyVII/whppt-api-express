const assert = require('assert');
const { publishCallBack } = require(`${process.cwd()}/whppt.config.js`);

module.exports = {
  exec({ $id, $mongo: { $publish, $save } }, { page }) {
    assert(page, 'A Page Object must be provided.');

    page._id = page._id || $id();
    page.published = true;
    return $save('pages', page).then(() => {
      return $publish('pages', page).then(() => {
        if (!publishCallBack || page.template === 'listing') return page;

        return publishCallBack(page).then(() => page);
      });
    });
  },
};
