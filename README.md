# youtube-dl-docker-node

Packages [`youtube-dl`]() as a Docker image, with a REST back-end in Node. Not
ideal, because `youtube-dl` is written in Python, so a Python back-end is a
better fit - if you know Python, that is. Which I don't; hence, this repo.

For a Python wrapper, see https://github.com/manbearwiz/youtube-dl-server

```sh
git clone ...
cd youtuble-dl-docker-node
docker build .
docker run <image>

# to download with httpie:
http --download localhost:1212/video/youtube.com/watch?v=bSE5ZSMqe_w
http --download localhost:1212/audio/youtube.com/watch?v=bSE5ZSMqe_w
```
