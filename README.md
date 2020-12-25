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
  - now that i think about it, why should the server and client have to be on the same network?? http/grpc file streaming should be fine for this i guess, and the server security can be handled by whoever's setting it up (just get an SSL cert and then wrap the server in that i guess). they can also take care of dns and stuff, not my problem lol
- graphql endpoint to communicate with frontend, should be over https because of the possibility of api keys being transferred...
- technologies
  - typescript! typescript everywhere!
  - deno on backend? deno seems pretty fun ngl
  - graphql because... idk, just google "why is graphql good"
  - core plugin server: rust? use traits to define spec for plugins??
    - try to use typescript for this because more developers are comfortable with this
    - possibly create a package manager for plugins so devs can publish/plug-n-play them
  - grpc mmmm. where does it all fit in tho... communication between microservices? i guess we can have a "core" microservice which communicates with the frontend and have the other microservices for different things in other clusters. those microservices can talk through grpc. will that be a lot of load on the core server though? i dont think so...
- frontend should be last priority (this is more of a note to self so i dont get carried away) BUT
  - next?
  - swr?
  - styled?
- keep consistent linting/formatting everywhere... possibly use what tails did; create an eslint config for project-wide use
- probably pnpm + pnpm workspaces for node stuff
- license! uhh this is gonna be awkward... probably something restrictive here. if this turns out to be actually useful i dont want people putting my (and potential future contributors') code out there without acknowledgement or whatever

## architecture

server + client; server imports github/misc git projects & calculates metadata server-side

server:

- deno!
- similar to tails, should have filesystem plugin (might be worthwile to build this client-compatible because we'll need it client-side to sync stuff)
- we could go all full-duplex and have the client connect to the server, server sends all the code??? and the client edits and changes persist to the server in real time (this is while editing code). might be a lot of server load though
  - the reason we need the client's code both client and server side is because all task running should take place server-side. all the client should have to do is provide a dockerfile and then expose that port server-side.
- the server should also handle running the frontend (which, i guess, is kinda full-stack because of next)
  - authentication should be required to access data. an email-password thing here? should be just a backend POST, but i'm not sure how the backend should store this data... anyway, the original user/pass should be configured on first launch and only resettable given physical access to the server
- we could have some non-sensitive (define non-sensitive tho? people might consider their repository information sensitive. not sure how to handle encryption here...) kv data we need persisting server-side, like projects that we've imported and categorized. i think you can just use protobuf to define a format for these and then serialize them to a file stream. just read it when the server starts up, and have it write whenever changes are made
- as for misc stuff like bookmarks and stickies and whatnot, a little database should work

client:

- might be worthwile to write this in a compiled language... although that would make it harder for plugin developers unless i somehow get interop between deno and rust
  - what if plugins just needed to have a port open and the client could just send requests to it when it's needed? that could allow the plugin system to be completely language-agnostic
- the client, like the server, should have a filesystem plugin (to keep track of writes that occur so they can be sent to the server)
- the goal of the client is to reduce load as much as possible. all processing of the program itself, running it, and deploying it (with one-click deployment stuff, similar to tails' design; we don't want to reinvent the wheel here) should take place server-side.
