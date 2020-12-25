# spot

an all-in-one self-hosted productivity suite for programmers!

HEAVILY inspired by [eankeen/tails](https://github.com/eankeen/tails)

## design goals

- ability to import dotfiles (lint, format, etc config) from selected repositories
- designate repositories as templates (special format for replaceable values)
- create folders or projects on local systems (generate script to set up local folder and pull template from server?)
- config/dotfile builder interface with plugins
  - rust (specify format directives, dependencies, targets, etc)
  - javascript (dotfiles, deps, scripts)
  - etc.
- package.json + custom task runner web interface (see stdin/stdout of build command)
- see project metadata (size, size gzipped, sloc, publishing status (PLUGINS!!))
- code browser? or just embed github/gitlab?
- for template generator stuff
  - auto use newest deps (plugin should match options to packages, etc)
  - MUST add "default" template option
- deploy containerized project in clusters (keep track of api keys)
  - LONG TERM: analytics!
- non-project stuff
  - file server for general productivity
  - sticky notes
  - bookmarks
  - (all localized on server, should be backed up somewhere though...)

## technical stuff

- since all of this is happening on your local network i dunno if security is a HUGE concern...
  - either way, all file transfers should be encrypted (ftp over ssl/ftp over ssh/http over ssl)
- compression method for sending repositories over network?
- regular http request? or is there a better way to transfer files on the same network... (ftps/sftp)
- graphql endpoint on backend, should be over https because of api keys...
- technologies
  - typescript! typescript everywhere!
  - deno on backend? deno seems pretty fun ngl
  - graphql because... idk, just google "why is graphql good"
  - core plugin server: rust? use traits to define spec for plugins??
    - try to use typescript for this because more developers are comfortable with this
    - possibly create a package manager for plugins so devs can publish/plug-n-play them
  - grpc mmmm. where does it all fit in tho...
- frontend should be last priority (this is more of a note to self so i dont get carried away) BUT
  - next?
  - swr?
  - styled?
- keep consistent linting/formatting everywhere... possibly use what tails did; create an eslint config for project-wide use
- probably pnpm + pnpm workspaces for node stuff
- license! uhh this is gonna be awkward... probably something restrictive here. if this turns out to be actually useful i dont want people putting my (and potential future contributors') code out there without acknowledgement or whatever
