declare namespace App.Data {
export type CategoryData = {
id: number;
name: string;
description: string | null;
color: string | null;
};
export type CommentData = {
id: string;
content: string;
is_private: boolean;
parent_comment_id: string | null;
user?: App.Data.UserData | null;
timeline_item?: App.Data.EventData | null;
replies?: Array<App.Data.CommentData> | null;
replies_count: number | null;
created_at: string | null;
updated_at: string | null;
};
export type CommentDataCollection = Array<App.Data.CommentData>;
export type EventData = {
id: string;
title: string;
content: string;
date: string | null;
timestamp: string | null;
is_urgent: boolean;
author: string | null;
category?: App.Data.CategoryData | null;
tags?: Array<App.Data.TagData> | null;
user?: App.Data.UserData | null;
family?: App.Data.FamilyData | null;
attachments: Array<any>;
linked_items: Array<any>;
comments?: Array<App.Data.CommentData> | null;
comments_count: number | null;
meta: { created_at: string | null; updated_at: string | null };
};
export type EventDataCollection = Array<App.Data.EventData>;
export type FamilyData = {
id: string;
name: string;
child_name: string | null;
};
export type TagData = {
id: number;
name: string;
};
export type TagDataCollection = Array<App.Data.TagData>;
export type UserData = {
id: string;
name: string;
email: string;
role: string;
roles: Array<string>;
family?: App.Data.FamilyData | null;
};
}
