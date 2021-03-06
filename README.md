# Chess With SocketIO

No longer under development as of November 2015. This was a good introduction to Node, Express, and SocketIO, but I have moved on to other projects.

# About

A real-time socketio based chess game using chessboard.js.

For a similar implementation see [socket.io chess](http://chess.thebinarypenguin.com/)

# Feedback

Code review, feedback or additions are appreciated. Fork and submit a pull request.

# External Libraries
This repository includes external libraries that are not available on npm.

* [chessboard.js](http://chessboardjs.com/) v0.3
* [chess.js](https://github.com/jhlywa/chess.js) commit cd9448f3d21124c39ed197e577df1d22b197f541

# Installation

* `npm install`
* `bower install`
* `gulp copy`

To run in dev mode: `gulp server`

If you run into problems installing socket.io on Windows, read [this](http://stackoverflow.com/questions/16469086/npm-cant-install-socket-io) StackOverflow thread.

# Future Improvement

* CSS Styling. Divs overlap when the browser window size is reduced.
* Move routing logic into new directory and files.
* Prefer if chess logic was handled server side to prevent cheating.
* Socket logic is not particularly robust. Needs to be hardened.
* Some of the socket logic should be moved outside of the routing functions.

# License

MIT - see the included LICENSE
