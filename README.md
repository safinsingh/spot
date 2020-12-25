# spot

an all-in-one self-hosted productivity suite for programmers!

HEAVILY inspired by [eankeen/tails](https://github.com/eankeen/tails)

# 12/25 update

here is a more concise and thought out version of what this actually is

now that i read this, this is a lot to do :/

spot is a(n):

- online productivity suite for programmers
  - it should have a wordpress-like login system (on the first start, create credentials, and use them forever)
    - email/password: forgot password email should be available
  - when you log in, it should show you a dashboard in which you can import repositories from git hosting sites. these are at the core of spot. it can't function if you don't want to use an online source control tool
  - when you import a repository
    - the dashboard should be able to give you basic metadata about it
      - size in kB
      - timestamp last updated
      - stars
    - you should be able to categorize a repository into different folders
  - say you want to run and edit a node project. this is what you need to do:
    - either import it from version control or generate with a template. since i already explained imports from version control, let's pretend this is from a template
    - say you have already created a boilerplate repository and it's hosted on github. you've put your ESLint config, Prettier config, and EditorConfig on it, along with some github actions
    - when you hit "generate from template" you'll be shown an embedded view of the dashboard but it is filtered to the `template` tag, which gets added once you configure a repository as a template
    - in that template repository, you've created a file called `spot.toml` at its root. it looks like this:

```toml
template = true
language = "node"

[config.eslint]
location = "/.eslintrc"

[config.prettier]
location = "/.prettierrc"

[bootstrap]
exclude = ["/LICENSE"]
```

    - spot reads this file and recognizes the `prettier` key because it is a built in template **plugin**
    - spot warns the user that a key named `eslint` was found but it wasn't able to do anything with it because it doesn't have the appropriate plugin
    - spot prompts the user to install this via the `store` page, which lists packages on the npm registry prefixed with `spot-plugin-*`. the user may choose to install this
    - spot walks through each known key in the template config and runs the plugin code associated with it. in this case, the plugin allows you to step through each config and mark a check box for each configuration you need. this is easily implemented because `check-box` style plugins are one of the valid plugin types that easily integrate with spot
    - after choosing the appropriate configurations for the `config` keys, spot looks into the `language` and `bootstrap` keys. if the `language` key exists and is valid (currently, node should be supported), it will trigger a series of actions associated with that language. in this case, it should read code from the built-in node plugin which will basically prompt you through scripts and dependencies, similar to the prompts for `prettier`
    - now that all the user configuration is complete, `spot` is ready to bootstrap the project. it starts by directly cloning the project (or downloading the tarball from source control, if available), removing the `.git` folder if it exists. then, it removes all files or directories specified by the `exclude` key under `bootstrap`. finally, it will remove all the files configured by plugins and rewrite them based on user-entered config. (spot also deletes all template-related information from the new repository)
    - once the project is ready for writing, the user opens (**FIXME**) some sort of connection to the server and begins editing. the web dashboard, since reading that the language is `node`, reads scripts from `package.json` and displays them in a list. say, for example, i'm building a `next.js` web app, and i'd like to view my development server. the user can simply click on the appropriate script and it will launch (containerized?) on the server. therefore, all development and writing of files simply takes place on the server

# initial thoughts

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

### updates

- no core server needed, the node server should route all of the grpc endpoints i think??

### initial thoughts

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
