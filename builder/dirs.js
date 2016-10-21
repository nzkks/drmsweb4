import fs from 'fs';
import path from 'path';
import _ from 'lodash';

function dirsFactory(root, config) {

  let dirs = {
    root: root,
    tmp: '.tmp',
    bower:  JSON.parse(fs.readFileSync('./.bowerrc')).directory,
    src: {
      root:   'src',
      server: 'src/server',
      client: 'src/client'
    },
    test: {
      root:   'test',
      server: 'test/server',
      client: 'test/client'
    },
    tgt: _.clone(config.dirs.tgt) || {}
  };

  _.defaults(dirs.tgt, {
    root: '.tmp'
  });

  _.defaults(dirs.tgt, {
    server: path.join(dirs.tgt.root, 'server'),
    client: path.join(dirs.tgt.root, 'client')
  });

  _.defaults(dirs.tgt, {
    clientVendor: path.join(dirs.tgt.client, 'vendor'),
    serverTest: path.join(dirs.tgt.server, 'test')
  });

  return dirs;
}

export default dirsFactory;
