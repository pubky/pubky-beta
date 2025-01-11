/* tslint:disable */
/* eslint-disable */
export function create_pubky_app_user(name: string, bio: string | undefined, image: string | undefined, links: any, status?: string): any;
export function create_pubky_app_feed(tags: any, reach: string, layout: string, sort: string, content: string | undefined, name: string): any;
export function create_pubky_app_file(name: string, src: string, content_type: string, size: bigint): any;
export function create_pubky_app_post(content: string, kind: string, parent: string | undefined, embed: any, attachments: any): any;
export function create_pubky_app_tag(uri: string, label: string): any;
export function create_pubky_app_bookmark(uri: string): any;
export function create_pubky_app_follow(pubky_id: string): any;
export function create_pubky_app_mute(pubky_id: string): any;
export function create_pubky_app_last_read(): any;
