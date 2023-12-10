import LoginView from "./viewScripts/LoginView.js";
import RegistrationView from "./viewScripts/RegistrationView.js";
import ProfileView from "./viewScripts/ProfileView.js";
import PostView from "./viewScripts/PostView.js";
import Authors from "./viewScripts/Authors.js";
import GroupsView from "./viewScripts/GroupsView.js";
import MainView from "./viewScripts/MainView.js";
import CreatePostView from "./viewScripts/CreatePostView.js";
import CommunityView from "./viewScripts/CommunityView.js";

export const routes = [
    { path: '/', view: MainView },
    { path: '/post/create', view: CreatePostView },
    { path: '/authors/', view: Authors },
    { path: '/communities', view: GroupsView },
    { path: '/post/:postId', view: PostView },
    { path: '/login/', view: LoginView },
    { path: '/register/', view: RegistrationView },
    { path: '/profile', view: ProfileView },
    { path: '/community/:communityId',view: CommunityView}
];
