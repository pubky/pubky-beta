#!/bin/bash

nx reset

npm un @pubky/common @pubky/common-server @pubky/tags @pubky/client

npm i

npm i ../skunk-works/assets/pubky-common-0.0.1.tgz
npm i ../skunk-works/assets/pubky-common-server-0.0.1.tgz
npm i ../skunk-works/assets/pubky-tags-0.0.1.tgz
npm i ../skunk-works/assets/pubky-client-0.0.1.tgz

nx serve web
