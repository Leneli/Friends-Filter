import { FriendFilter } from './friend-filter.js';
require('./index.css');

var loadButton = document.getElementById('loadFriends');
var reloadButton = document.getElementById('reloadFriends');
var saveButton = document.getElementById('save');
var cleanButton = document.getElementById('clean');

var leftList = document.getElementById('friends_item_left_inner_block');
var rightList = document.getElementById('friends_item_right_inner_block');
var inputFilterLeft = document.getElementById('friends_item_search_left_input');
var inputFilterRight = document.getElementById('friends_item_search_right_input');
var leftFriendsCounter = document.getElementById('leftFriendsCounter');
var rightFriendsCounter = document.getElementById('rightFriendsCounter');


FriendFilter.init({
	ID: 6198491,
	leftList: leftList,
	rightList: rightList,
	inputFilterLeft: inputFilterLeft,
	inputFilterRight: inputFilterRight,
	leftFriendsCounter: leftFriendsCounter,
	rightFriendsCounter: rightFriendsCounter,
	loadButton: loadButton,
	reloadButton: reloadButton,
	saveButton: saveButton,
	cleanButton: cleanButton
});

FriendFilter.dnd();