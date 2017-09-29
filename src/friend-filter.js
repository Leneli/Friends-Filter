var FriendFilter = (function () {
    var __private = {
        set(args) {
            this.allFriends;
            this.selectedFriends = [];
            this.ID = args.ID;
            this.friends = args.friends;
            this.leftList = args.leftList;
            this.rightList = args.rightList;
            this.inputFilterLeft = args.inputFilterLeft;
            this.inputFilterRight = args.inputFilterRight;
            this.leftFriendsCounter = args.leftFriendsCounter;
            this.rightFriendsCounter = args.rightFriendsCounter;
            this.loadButton = args.loadButton;
            this.reloadButton = args.reloadButton;
            this.saveButton = args.saveButton;
            this.cleanButton = args.cleanButton;

            this.loadButton.addEventListener('click', function() {
                document.querySelector('.layout').classList.remove('hidden');

                __private.rightList.innerHTML = null;

                __private.login()
                    .then(
                        () => __private.getFriends('friends.get', { v: 5.62, fields: ['city', 'country', 'photo_100', 'user_id', 'order: random'] })
                    )
                    .then(
                        (result) => {
                            __private.leftList.innerHTML = __private.createModal(result.items);
                            __private.allFriends = result.items;
                            __private.leftFriendsCounter.innerHTML =  __private.allFriends.length;
                            __private.rightFriendsCounter.innerHTML =  __private.selectedFriends.length;
                        }
                    )
            });

            document.addEventListener('click', function(event) {
                event = event || window.event;

                if (event.target.classList.contains('layout_container_close') || event.target.getAttribute('src') == 'img/cross.png') {
                    document.querySelector('.layout').classList.add('hidden');
                }
            });

            this.leftList.addEventListener('click', __private.listsEvent);
            this.rightList.addEventListener('click', __private.listsEvent);

            this.inputFilterLeft.addEventListener('keyup', function() {
                if (__private.inputFilterLeft.value == '') {      
                    __private.leftList.innerHTML = __private.createModal(__private.allFriends);
                    __private.leftFriendsCounter.innerHTML = __private.allFriends.length;
            
                    return;
                }

                var newFilteredArrayLeft = [];
            
                for (var i = 0; i < __private.allFriends.length; i++) {
                    if (__private.isMatching(__private.allFriends[i].first_name + ' ' + __private.allFriends[i].last_name, __private.inputFilterLeft.value)) {
                        newFilteredArrayLeft.push(__private.allFriends[i]);
                    }
                }
                
                __private.leftList.innerHTML = __private.createModal(newFilteredArrayLeft);
                __private.leftFriendsCounter.innerHTML = newFilteredArrayLeft.length;
            });

            this.inputFilterRight.addEventListener('keyup', function() {
                if (this.value == '') {
                    __private.rightList.innerHTML = __private.createModal(__private.selectedFriends);
                    __private.rightFriendsCounter.innerHTML = __private.selectedFriends.length;
            
                    return;
                }
            
                var newFilteredArrayRight = []
            
                for (var i = 0; i < __private.selectedFriends.length; i++) {
                    if (__private.isMatching(__private.selectedFriends[i].first_name + ' ' + __private.selectedFriends[i].last_name, __private.inputFilterRight.value)) {
                        newFilteredArrayRight.push(__private.selectedFriends[i]);
                    }
                }
                __private.rightList.innerHTML = __private.createModal(newFilteredArrayRight);
                __private.rightFriendsCounter.innerHTML = newFilteredArrayRight.length;
            });

            this.saveButton.addEventListener('click', function(event) {
                event = event || window.event;
                event.preventDefault();

                var data = {
                    arrayLeft: __private.allFriends,
                    arrayRight: __private.selectedFriends
                }    
            
                localStorage.myFriends = JSON.stringify(data);
                __private.cleanButton.removeAttribute('disabled');
            });

            this.cleanButton.addEventListener('click', function(event) {
                event = event || window.event;
                event.preventDefault();

                if (confirm('Вы действительно хотите очистить localStorage?')) {
                    localStorage.clear();
                    this.setAttribute('disabled', 'true');
                } 
            });

            window.addEventListener('load', function() {
                if (localStorage.length < 1) {
                    __private.cleanButton.setAttribute('disabled', 'true');
                }
                if (localStorage.length > 0) {
                    document.querySelector('.layout').classList.remove('hidden');
                    __private.cleanButton.removeAttribute('disabled');
                    __private.leftList.innerHTML = __private.createModal(JSON.parse(localStorage.myFriends).arrayLeft);
                    __private.rightList.innerHTML = __private.createModal(JSON.parse(localStorage.myFriends).arrayRight);
                    __private.leftFriendsCounter.innerHTML = JSON.parse(localStorage.myFriends).arrayLeft.length;
                    __private.rightFriendsCounter.innerHTML = JSON.parse(localStorage.myFriends).arrayRight.length;
                    __private.allFriends = JSON.parse(localStorage.myFriends).arrayLeft;
                    __private.selectedFriends = JSON.parse(localStorage.myFriends).arrayRight;
                }
            });
        },

        login() {
            return new Promise(function (resolve, reject) {
                VK.init({ apiId: __private.ID });

                VK.Auth.login(function (result) {
                    if (result.status == 'connected') resolve();
                    else reject(result.error);
                });
            });
        },

        getFriends(method, params) {
            return new Promise(function(resolve, reject) {
                VK.Api.call(method, params, function(result) {
                    if (result.error) reject(result.error);
                    else resolve(result.response);
                })
            })
        },

        createModal(friends) {
            var templateFn = require('../friend-template.hbs');

            var sortedFriends = friends.sort(sortingById);

            function sortingById(a, b) {
                if (a.id > b.id) return 1;
                if (a.id < b.id) return -1;
            }
        
            return templateFn({
                friends: sortedFriends
            });
        },

        findParent(elem, classToFind) {
            if (elem.classList.contains(classToFind)) return elem;
        
            elem = elem.parentNode;
        
            return __private.findParent(elem, classToFind);
        },

        equallElems(fromArr, toArr, equall) {
            for(var i = 0; i < fromArr.lengthl; i++) {
                if(equall == 'me'+fromArr[i].id) {           
                    toArr.unshift(fromArr[i])
                    fromArr.splice(i, 1);
                }
            }
        },

        eventGenerate(eventName, onElement) {
            var newEvent = new Event(eventName);
            onElement.dispatchEvent(newEvent);
        },

        isMatching(what, where) {
            var whatEqual = what.toLowerCase();
            var whereEqual = where.toLowerCase();
            var matchValue = whatEqual.indexOf(whereEqual);
        
            if (matchValue > -1) return true;
        
            return false;
        },

        listsEvent(event) {
            event = event || window.event;
            event.preventDefault();

            var deleteFrom;
            var insertTo;
            var whoMove;
            var leftlistfriends = __private.leftList;
            var rightlistfriends = __private.rightList;
        
            if (event.target.classList.contains('one_friend_item_plus') || event.target.classList.contains('one_friend_item_plus_image')) {
                if (__private.findParent(event.target, 'friends_inner').id == 'friends_item_left_inner_block') {
                    whoMove = __private.findParent(event.target, 'one_friend').id;
                    deleteFrom = __private.allFriends;
                    insertTo = __private.selectedFriends;
                }
                else if (__private.findParent(event.target, 'friends_inner').id == 'friends_item_right_inner_block') {
                    whoMove = __private.findParent(event.target, 'one_friend').id;
                    deleteFrom = __private.selectedFriends;
                    insertTo = __private.allFriends;
                    leftlistfriends = __private.rightList;
                    rightlistfriends = __private.leftList;
                } 
                for(var i = 0; i < deleteFrom.length; i++) {
                    if(whoMove == 'me'+deleteFrom[i].id) {
                        insertTo.unshift(deleteFrom[i]);
                        deleteFrom.splice(i, 1);
                    }
                }
        
                leftlistfriends.innerHTML = __private.createModal(deleteFrom);
                rightlistfriends.innerHTML = __private.createModal(insertTo);
        
                __private.leftFriendsCounter.innerHTML = __private.allFriends.length;
                __private.rightFriendsCounter.innerHTML = __private.selectedFriends.length;
        
                __private.eventGenerate('keyup', __private.inputFilterRight);
                __private.eventGenerate('keyup', __private.inputFilterLeft);  
            }
        },

        dnd() {
            window.drag = function(e) {
                e.dataTransfer.setData('text', e.target.id);
            }
            
            window.drop = function(e) {
                e.preventDefault();
                var data = e.dataTransfer.getData('text');
            
                e.target.appendChild(document.querySelector('#' + data + ''));
            
                for(var i = 0; i < __private.allFriends.length; i++) {
                    if(data == 'me'+__private.allFriends[i].id) {
                        __private.selectedFriends.unshift(__private.allFriends[i])
                        __private.allFriends.splice(i,1);
                    }
                }
            
                __private.leftList.innerHTML = __private.createModal(__private.allFriends);
                __private.rightList.innerHTML = __private.createModal(__private.selectedFriends);
                __private.leftFriendsCounter.innerHTML = __private.allFriends.length;
                __private.rightFriendsCounter.innerHTML = __private.selectedFriends.length;
            
                __private.eventGenerate('keyup', __private.sinputFilterLeft);
                __private.eventGenerate('keyup', __private.sinputFilterRight);
            }
            
            window.allowDrop = function(e) {
                e.preventDefault();
            }
        }
    };

    return {
        init(args) {
            __private.set(args);
        },

        dnd() {
            __private.dnd();
        }
    };
})();

export { FriendFilter };