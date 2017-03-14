// /// <reference path="../pages/login.html" />
// angular.module('starter.controllers', [])
//     .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $cordovaImagePicker) {
//         // Form data for the login modal
//         $scope.loginData = {};
//         $scope.imgSrc = "";
//         // Create the login modal that we will use later
//         $ionicModal.fromTemplateUrl('templates/login.html', {
//             scope: $scope
//         }).then(function (modal) {
//             $scope.modal = modal;
//         });

//         // Triggered in the login modal to close it
//         $scope.closeLogin = function () {
//             $scope.modal.hide();
//         };

//         // Open the login modal
//         $scope.login = function () {
//             $scope.modal.show();
//         };

//         //image picker
//         $scope.pickImage = function () {

//             console.log("haha");

//             var options = {
//                 maximumImagesCount: 1,
//                 width: 800,
//                 height: 800,
//                 quality: 80
//             };

//             $cordovaImagePicker.getPictures(options)
//                 .then(function (results) {
//                     console.log(results);
//                     $scope.imgSrc = results[0];
//                 }, function (error) {
//                     // error getting photos
//                 });

//         }

//         // Perform the login action when the user submits the login form
//         $scope.doLogin = function () {
//             console.log('Doing login', $scope.loginData);

//             // Simulate a login delay. Remove this and replace with your login
//             // code if using a login system
//             $timeout(function () {
//                 $scope.closeLogin();
//             }, 1000);
//         };
//     })

//     .controller('PlaylistsCtrl', function ($scope) {
//         $scope.playlists = [
//             { title: 'Reggae', id: 1 },
//             { title: 'Chill', id: 2 },
//             { title: 'Dubstep', id: 3 },
//             { title: 'Indie', id: 4 },
//             { title: 'Rap', id: 5 },
//             { title: 'Cowbell', id: 6 }
//         ];
//     })

//     .controller('PlaylistCtrl', function ($scope, $stateParams) {
//     });


const anonymous={ profile:{username: "<anonymous>",pk:0}, token:-1, isAnonymous: true };//use "user = angular.copy(anonymous)" instead of "user = anonymous"
const defaults={
	token:-1,
	user:anonymous,
	init:true
        //and other settings need to store
	};
app.controller('MainCtrl', function($scope, $http, $ionicPlatform, $ionicPopup, $ionicModal, $cordovaImagePicker,  $cordovaFileTransfer, $ionicLoading, $timeout, ngProgress){
	$ionicModal.fromTemplateUrl('pages/guide.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.guideModal = modal
	})

	$scope.todo=function(){
		$scope.showAlert("comming soon",'we\'re working on making this available - so stay tuned!')
	}
	
	$scope.global=angular.copy(defaults);

	$scope.t = "";
	console.log('def t');
	
	$scope.feedback = "";
	console.log('def feedback');
	
	$scope.detailItem = {};
	
	$scope.addr=function(str){
		return (str)?site_join(str):null;
	}
	angular.forEach(localStorage, function(v, k) {
		$scope.global[k.slice(10)]=angular.fromJson(v);
	});
	console.log($scope.global);
	$scope.TMPlocalStorage=angular.copy($scope.global);
	$scope.$watch(function(){
		if (!angular.equals($scope.global, $scope.TMPlocalStorage)){
			temp$storage = angular.copy($scope.global);
			angular.forEach(temp$storage, function(v, k) {
				angular.isDefined(v) && '$' !== k[0] && localStorage.setItem('ngStorage-' + k, angular.toJson(v));
				delete temp$storage[k];
			});
			for (var k in temp$storage) {
				localStorage.removeItem('ngStorage-' + k);
			}
			$scope.TMPlocalStorage=angular.copy($scope.global);
		}
	});
	if($scope.global.init){
		$ionicModal.fromTemplateUrl('pages/guide.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.GuideModal=modal;
			modal.show();
			$scope.closeModal=function(){$scope.GuideModal.hide()};
		})
		$scope.global.init=false;
	}

	$scope.whoami=function(){
		$http.get(site_join('/whoami/'+$scope.global.user.profile.pk+':'+$scope.global.token))
			.success(function (data, status, headers, config) {
				//data=JSON.parse(data);
				if(data.ok)
					if(data.profile=="undefined") $scope.global.user=angular.copy(anonymous);
					else $scope.global.user= { profile:data.profile, isAnonymous: false };
				else $scope.global.user=angular.copy(anonymous);
				console.log($scope.global.user);
			});
    };

    $scope.whoami(); 

	$ionicLoading.show({
		animation:'fade-out',
		showBackdrop: true,
        template: '<div class="sk-spinner sk-spinner-chasing-dots"><div class="sk-dot1"></div><div class="sk-dot2"></div></div>',
	});

	$timeout(function() {
		$ionicLoading.hide();
	}, 2000);

//alert modal
	$scope.showAlert = function(titles,context) {
		var alertPopup = $ionicPopup.alert({
			title: titles,
			template: context+'<div class="qaqimg"></div>'
		});
		alertPopup.then(function(res) {
			console.log('alert:'+context);
		});
	};
 
//login modal
	$ionicModal.fromTemplateUrl('pages/login.html', {scope: $scope, backdropClickToClose: false})
		.then(function(modal) {$scope.LoginModal = modal});
	$scope.openLoginModal = function() {
		console.log('show login');
		$scope.LoginModal.show();
	}
	$scope.closeLoginModal = function() {
		$scope.LoginModal.hide();
	}

//register modal
	$ionicModal.fromTemplateUrl('pages/register.html', {scope: $scope, backdropClickToClose: false})
		.then(function(modal) {$scope.RegisterModal = modal});
	$scope.openRegisterModal = function() {
		console.log('show register');
		$scope.RegisterModal.show();
	}
	$scope.closeRegisterModal = function() {
		$scope.RegisterModal.remove();
		$ionicModal.fromTemplateUrl('pages/register.html', {scope: $scope, backdropClickToClose: false})
			.then(function(modal) {$scope.RegisterModal = modal});
	}

//termsofuse modal
	$ionicModal.fromTemplateUrl('pages/termsofuse.html', {scope: $scope, backdropClickToClose: false})
		.then(function(modal) {$scope.TermsModal = modal});
	$scope.openTerms = function() {
		console.log('show termsofuse');
		$scope.TermsModal.show();

	}
	$scope.closeTerms = function() {
		$scope.TermsModal.hide();
	}

//forgotten modal
	$ionicModal.fromTemplateUrl('pages/forgotten.html', {scope: $scope, backdropClickToClose: false})
		.then(function(modal) {$scope.ForgottenModal = modal});
	$scope.openForgottenModal = function() {
		console.log(' ');
		$scope.ForgottenModal.show();
	}
	$scope.closeForgottenModal = function() {
		$scope.ForgottenModal.hide();
	}

//userinfo modal
	$ionicModal.fromTemplateUrl('pages/userinfo.html', {scope: $scope, backdropClickToClose: false})
    .then(function(modal) {$scope.InfoModal = modal});
    $scope.openInfoModal = function(Upk) {
        ngProgress.start();
        $scope.InfoModal.show();
	console.log(Upk);
	$http.get(site_join('/accounts/profile/'+Upk+'/'))
		.success(function(data, status, headers, config){
          if(data.ok){
            $scope.u=data.user;
          }
          ngProgress.complete();
        })
		.error(function(data, status, headers, config){
			$scope.showAlert('Oops!','something wrong with it.');
	        ngProgress.complete();
		});
	}
	$scope.closeInfoModal = function() {
		$scope.InfoModal.hide();
	}

      //editprofile
	$ionicModal.fromTemplateUrl('pages/useredit.html', {scope: $scope, backdropClickToClose: false})
		.then(function(modal) {$scope.EditModal = modal});
	$scope.openEditModal = function() {
		if ($scope.global.user.isAnonymous){
			console.log('is anon');
			$scope.showAlert("Oops","please login first!");
			$scope.openLoginModal();
		}
		else{
			console.log('show editmodal');
			console.log('pre profile:'+$scope.global.user.profile.NickName);
			console.log('pre t:'+$scope.t.NickName);
			$scope.EditModal.show();
			$scope.t =angular.copy($scope.global.user.profile); 
			delete $scope.t.Avatar;
			delete $scope.t.friends_num;
			delete $scope.t.username;
			delete $scope.t.pk;
			console.log('t:'+$scope.t.NickName);
			console.log('user:'+$scope.global.user.profile.NickName);
		}
	}
	$scope.closeEditModal = function() {
		$scope.EditModal.hide();
	}

//create appoint modal
	$scope.openCreateAppointModal = function(TAG) {
		$scope.TAG=TAG;
		if($scope.global.user.isAnonymous) {
			$scope.next=function(){     
				$ionicModal.fromTemplateUrl('pages/new-eat.html', {scope: $scope,animation: 'slide-in-up', backdropClickToClose: false})
					.then(function(modal) {
						console.log('do create');
						$scope.AppointModal = modal;
						$scope.AppointModal.show();
					});
					$scope.next=undefined;
			};
			$scope.openLoginModal();
			return;
		}else 
			$ionicModal.fromTemplateUrl('pages/new-eat.html', {scope: $scope,animation: 'slide-in-up', backdropClickToClose: false})
				.then(function(modal) {
					$scope.AppointModal = modal;
					$scope.AppointModal.show();
				});
    }

	$scope.closeCreateAppointModal = function() {
		$scope.AppointModal.hide();
		$scope.AppointModal.remove();
	};


//appoint detail modal
	$ionicModal.fromTemplateUrl('pages/detail.html', {scope: $scope, backdropClickToClose: false})
		.then(function(modal) {$scope.DetailModal = modal});
	$scope.openDetailModal = function(id) {
		ngProgress.start();
		$scope.DetailModal.show();
		console.log('show detailModal');
		$http.get(site_join('/appoints/detail/'+id+':'+$scope.global.user.profile.pk))
			.success(function(data, status, headers, config){
				if(data.ok){
					data.data.Image=site_join(data.data.Image);
					$scope.detailItem=data.data;
					$scope.detailItem.joined=data.joined;
					//$scope.detailItem.closed=data.data.ifClosed;
					$scope.detailItem.attenders.push(data.data.creator);
					console.log('detailItem:');
					console.log($scope.detailItem);
				}
				else { 
					$scope.event=undefined; 
					$scope.showAlert("oops!","something wrong with it. Please try again."); 
					$scope.DetailModal.hide();
				}
				ngProgress.complete();
				console.log($scope.event);
			})
			.error(function(data, status, headers, config){
				ngProgress.complete();
				$scope.showAlert("oops!","Network error.");
			});

	};
	
    $scope.closeDetailModal = function() {
        ngProgress.reset();
        $scope.DetailModal.hide();
		$scope.detailItem = {};
    };



    $scope.$on('$destroy', function() {
    $scope.LoginModal.remove();
    $scope.RegisterModal.remove();
    $scope.InfoModal.remove();
    $scope.DetailModal.remove();
    });

	$scope.showFeedback = function() {
		console.log('show feedback');
		var myPopup = $ionicPopup.show({
			template: '<textarea id="feedbackText" ng-model="feedback" style="background-color:#f8f8f8;" rows=8 placeholder="it would be so nice of you to say something to us!" class="padding col"></textarea>',
			title: 'Feedback',
			scope: $scope,
			buttons: [
				{	text: 'cancel' },
				{
					text: 'submit',
					type: 'button-positive',
					onTap: function( ) {	
						$scope.feedback = document.getElementById('feedbackText').value;
						console.log('submitting, data:'+$scope.feedback);
						$scope.showAlert('thanks','your message is being delievered to us. Please enjoy exploring more about Howru app!');
						$http.post(site_join('/feedback/'),{
							data:$scope.feedback,
							pk_user:$scope.global.user.profile.pk,
							token:$scope.global.token
						})
						.success(function(data, status, headers, config){
							//data=JSON.parse(data);
							if(data.ok) {}
							//else {$scope.showAlert("Oops!","something wrong! feedback cannot be sent.");}
						})
						.error(function(data, status, headers, config){$scope.showAlert("Oops!","internet error! feedback cannot be sent.");});
					}
				}
			]
		});
		myPopup.then(function(res) {
			console.log('submit feedback', res);
		});
	};
	
	
})

.controller('ChatsCtrl', function($scope, $ionicLoading, Chats) {//TODO
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
    $ionicLoading.show({
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 100,
    showDelay: 0
  });
  $timeout(function() {
    $ionicLoading.hide();
    $scope.chats = Chats.all();
  }, 2000);
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {//TODO
  $scope.chat = Chats.get($stateParams.chatId);
})


.controller('LeftCtrl', function($scope, $state, $ionicSideMenuDelegate) {//TODO
$scope.toggleLeftSideMenu = function() {
$ionicSideMenuDelegate.toggleLeft();
};
})

.controller('RightCtrl', function($scope, $state, $ionicSideMenuDelegate) {//TODO
$scope.toggleRightSideMenu = function() {
$ionicSideMenuDelegate.toggleRight();
};
})

.controller('UpCtrl', function($scope, $ionicActionSheet, $ionicPopup) {//TODO

  $scope.imgURI='img/user.svg';

  $scope.selectImage=function(){
    var options = {
        maximumImagesCount: 1,
        width: 200,
        height: 200,
        quality: 50
    };
    $cordovaImagePicker.getPictures(options)
    .then(function (results) {
        $scope.imgURI=results[0];
    }, function(err) {
        // Error
    }, function (progress) {
        // constant progress updates
    });
  }

  $scope.showPopup = function() {
  $scope.data = {}

 };
 // A confirm dialog
 $scope.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'exit edit',
     template: 'are you sure you want to give up this template?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       console.log('You are sure');
       ngProgress.reset();
       $scope.closeCreateAppointModal();
     } else {
       console.log('You are not sure');
  }
   });
 };

})

.controller('UserCtrl', function($scope, $timeout, $http, $ionicModal, $ionicLoading, $templateCache, $ionicPopup, $cordovaImagePicker, $cordovaFileTransfer) {//TODO
	$scope.loading = false;
	
	$ionicModal.fromTemplateUrl('pages/profile.html', {
		scope: $scope, backdropClickToClose: false
	}).then(function(modal) {
		$scope.modal = modal
	})
	$scope.imgURI='img/user.svg';
	$scope.selectImage=function(){
		var options = {
			maximumImagesCount: 1,
			width: 200,
			height: 200,
			quality: 50
		};
		$cordovaImagePicker.getPictures(options)
			.then(function (results) {
				$scope.imgURI=results[0];
			}, function(err) {
            // Error
			}, function (progress) {
            // constant progress updates
		});
	};

	$scope.openModal = function() {
		console.log('hello');
		$scope.whoami();
		if($scope.global.user.isAnonymous){
			$scope.openLoginModal();
		}else{
			$scope.modal.show();
		}
	}

	$scope.closeModal = function() {
		$scope.modal.hide()
	}

	$scope.$on('$destroy', function() {
		$scope.modal.remove()
	});

	//$scope.t =angular.copy($scope.global.user.profile); 
	//delete $scope.t.Avatar;
	//delete $scope.t.friends_num;
	//delete $scope.t.username;
	//delete $scope.t.pk;
	$scope.changeProfile=function(){
		console.log('pre profile:'+$scope.global.user.profile);
		console.log('input t:'+$scope.t.NickName);
		console.log('post t:'+$scope.t.NickName);
		$scope.loading = true;
		$http.post(site_join('/accounts/profile/change/'),
		{
			data:JSON.stringify($scope.t),
			pk_user:$scope.global.user.profile.pk,
			token:$scope.global.token
		})
		.success(function(data, status, headers, config){
			$scope.loading = false;
			if(data.ok){
				$scope.showAlert('Success','Profile changed.');
				$scope.global.user.profile.NickName=angular.copy($scope.t.NickName);
				$scope.global.user.profile.WeChat=angular.copy($scope.t.WeChat);
				$scope.global.user.profile.Phone=angular.copy($scope.t.Phone);
				$scope.global.user.profile.Sayings=angular.copy($scope.t.Sayings);
				console.log('revised profile:'+$scope.global.user.profile);
				$scope.closeEditModal();
				$scope.openModal();
			}
			else $scope.showAlert("Oops!","Internet error.");
			$timeout($scope.whoami,2000); 
		})
		.error(function(data, status, headers, config){
			$scope.loading = false;
			$scope.showAlert("Oops!","Internet error.");
			$scope.closeEditModal();
			$scope.openModal();
		});
	}
	
	$scope.showPopup = function() {	
  	// An elaborate, custom popup
		var myPopup = $ionicPopup.show({
			template: '<div class="useruserimgc" ng-controller="UpCtrl" ng-click="selectImage()"></div>' +
				'<item class="item item-icon-left"><i class="icon icon-awicon-user"></i><input type="text" ng-model="t.NickName"name="name" placeholder="name" required></item>' +
				'<item class="item item-icon-left"><i class="icon icon-awicon-wechat"></i><input type="text" ng-model="t.WeChat" name="wechat" placeholder="wechat ID" required></item>' +
				'<item class="item item-icon-left"><i class="icon icon-awicon-no"></i><input type="text" ng-model="t.Phone" name="mobile" placeholder="mobile no."></item>' +
				'<item class="item item-icon-left"><i class="icon icon-awicon-plus"></i><input type="text" ng-model="t.Sayings" name="interests" placeholder="any Sayings?"></item>',
			title: 'edit my profile',
			scope: $scope,
			buttons: [
				{ text: 'cancel' },
				{
					text: 'save',
					type: 'button-positive',
					onTap: function(e) {
						$scope.changeProfile();
					}
				}
			]
		});
		myPopup.then(function(res) {
			$ionicLoading.hide();
			console.log('Tapped!', res);
		});
	};

})

.controller('HistoryCtrl', function($scope, $http, $ionicLoading, $ionicModal, $templateCache, $ionicPopup) {
	$scope.historyEvents=[];

	$scope.data = {
		showDelete: false
	};
  
	$ionicModal.fromTemplateUrl('pages/history.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.openModal = function() {
		if($scope.global.user.isAnonymous) { $scope.openLoginModal();return;}
		console.log('open history');
		$ionicLoading.show({
			animation:'fade-out',
			showBackdrop: true,
			template:'<div class="sk-spinner sk-spinner-chasing-dots"><div class="sk-dot1"></div><div class="sk-dot2"></div></div>',
		});
		console.log('username:'+$scope.global.user.username);
		console.log('profile.username:'+$scope.global.user.profile.username);
		$scope.req={
			Refresh:'middle',
			filter:{
				username:$scope.global.user.profile.username
			},
			ApptID:''
		};
		console.log('post req');
		$http.post(site_join('/appoints/user_history/'),{
			data:JSON.stringify($scope.req),
			pk_user:$scope.global.user.profile.pk,
			token:$scope.global.token
		})
		.success(function(data, status, headers, config){
			$ionicLoading.hide();
			//data=JSON.parse(data);
			if(data.ok){
				if(data.refresh) $scope.historyEvents=data.events;
				else $scope.historyEvents=data.events.concat($scope.historyEvents);
			}else $scope.showAlert("Oops!","internet error");
		});
		$scope.modal.show()
	}

	$scope.closeModal = function() {
		$ionicLoading.hide();
		$scope.modal.hide();
		$scope.historyEvents=[];
	}

	$scope.doRefresh = function() {
		console.log('tags:'+$scope.tags);
		$scope.moreDataCanBeLoaded=true;
		$scope.req={
			Refresh:'top',
			filter:{
				username:$scope.global.user.profile.username,
				actTags:['A','H','S','E']
			},
			ApptID:(!$scope.historyEvents.length)?'':$scope.historyEvents[0].ApptID
		};

		$http.post(site_join('/appoints/user_history/'),{
			data:JSON.stringify($scope.req),
			pk_user:$scope.global.user.profile.pk,
			token:$scope.global.token
		})
		.success(function(data, status, headers, config){
			//data=JSON.parse(data);
			if(data.ok){
				if(data.refresh) $scope.historyEvents=data.events;
				else $scope.historyEvents=data.events.concat($scope.historyEvents);
			}
			else $scope.showAlert("Oops!","internet error");
		});
		$scope.$broadcast('scroll.refreshComplete');
		$scope.$apply();
	};

//infinite scroll
	$scope.loadMore = function() {
		console.log("loadmore");
		$scope.req={
			Refresh:'bottom',
			filter:{
				username:$scope.global.user.profile.username,
				actTags:['A','H','S','E']
			},
			ApptID:(!$scope.historyEvents.length)?'':$scope.historyEvents[$scope.historyEvents.length-1].apptID
		};
		//$timeout(function() { $scope.$apply(function(){ $timeout(function() { $scope.$broadcast('scroll.infiniteScrollComplete');  }); });});
		$http.post(site_join('/appoints/user_history/'),
		{
			data:JSON.stringify($scope.req),
			pk_user:$scope.global.user.profile.pk,
			token:$scope.global.token
		})
		.success(function(data, status, headers, config) {
			//data=JSON.parse(data);
			console.log(data);
			if(data.ok){
				data=data.events;
				console.log($scope.historyEvents);
				if(data!=[]){
					if($scope.historyEvents!=[]) $scope.historyEvents=$scope.historyEvents.concat(data);
					else $scope.historyEvents=data;
				}
			}
			$scope.$broadcast('scroll.infiniteScrollComplete');
		})

		.error(function(data, status, headers, config) {
			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
		$scope.$on('$stateChangeSuccess', function() {
			$scope.loadMore();
		});
	};
	
	$scope.drop = function (e){
		console.log('do drop');
		console.log('drop apptID:'+e.ApptID);
		if (e.creator.pk == $scope.global.user.profile.pk)
			$scope.close(e.ApptID);
		else 
			$scope.exit(e.ApptID);
	}
	
	$scope.exit = function(apptID){
		console.log('do exit');
		//$scope.showConfirm = function() {
			var confirmPopup = $ionicPopup.confirm({
				title: 'exit activity',
				template: 'are you sure you want to exit the activity?'
			});
			confirmPopup.then(function(res) {
				if(res) {
					console.log('exit sure');
					console.log('post apptID:'+apptID);
					$http.post(site_join('/appoints/exit/'),{
						data:JSON.stringify({ApptID:apptID}),
						token:$scope.global.token,
						pk_user:$scope.global.user.profile.pk
					})
					.success(function(data, status, headers, config){
						if(data.ok) {
							$scope.showAlert("success","exit success!");
						} else {
							$scope.showAlert("error", "something wrong!");
						}
					})
					.error(function(data, status, headers, config){
						$scope.showAlert("Oops", "internet error!");
					});
					//refresh activities
				} else {
					console.log('exit not sure');
				}
			});
		//};
	}
	
	$scope.close = function(apptID){
		console.log('do close');
		//$scope.showConfirm = function() {
			var confirmPopup = $ionicPopup.confirm({
				title: 'close activity',
				template: 'are you sure you want to close the activity?'
			});
			confirmPopup.then(function(res) {
				if(res) {
					console.log('close sure');
					console.log('post apptID:'+apptID);
					$http.post(site_join('/appoints/close/'),{
						data:JSON.stringify({ApptID:apptID}),
						token:$scope.global.token,
						pk_user:$scope.global.user.profile.pk
					})
					.success(function(data, status, headers, config){
						if(data.ok) {
							$scope.showAlert("success","close success!");
						} else {
							$scope.showAlert("error", "something wrong!");
						}
					})
					.error(function(data, status, headers, config){
						$scope.showAlert("Oops", "internet error!");
					});
				} else {
					console.log('close not sure');
				}
			});
		//};
	}
	
	$scope.delete = function(apptID){
		console.log('do delete');
		//$scope.showConfirm = function() {
			var confirmPopup = $ionicPopup.confirm({
				title: 'delete activity',
				template: 'are you sure you want to delete the activity?'
			});
			confirmPopup.then(function(res) {
				if(res) {
					console.log('delete sure');
					console.log('post apptID:'+apptID);
					$http.post(site_join('/appoints/delete/'),{
						data:JSON.stringify({ApptID:apptID}),
						token:$scope.global.token,
						pk_user:$scope.global.user.profile.pk
					})
					.success(function(data, status, headers, config){
						if(data.ok) {
							$scope.showAlert("success","delete success!");
						} else {
							$scope.showAlert("error", "something wrong!");
						}
					})
					.error(function(data, status, headers, config){
						$scope.showAlert("Oops", "internet error!");
					});
				} else {
					console.log('delete not sure');
				}
			});
		//};
	}
})

.controller('PrefCtrl', function($scope, $ionicModal, $templateCache, $ionicActionSheet, $ionicPopup, $http, $ionicLoading) {

	$scope.dataPwd = {};
	$scope.newPwdre = {};

  $ionicModal.fromTemplateUrl('pages/preference.html', {
    scope: $scope, backdropClickToClose: false
  }).then(function(modal) {
    $scope.modal = modal
  })

  $scope.openModal = function() {
    console.log('hello');
   	$scope.modal.show();
  }

  $scope.closeModal = function() {
    $scope.modal.hide()
  }

  $scope.$on('$destroy', function() {
    $scope.modal.remove()
  });



  $scope.cleanHistoryConfirm = function() {
    $ionicActionSheet.show({
     destructiveText: 'clear all chat history',
     titleText: 'r u sure?',
     cancelText: 'Cancel',
     buttonClicked: function(index) {
       return true;
     },
     destructiveButtonClicked: function(){
        console.log('do clear history');
        return true;
     }
   });
  };

    $scope.logoutConfirm = function() {
        console.log("call logout confirm");
       var confirmPopup = $ionicPopup.confirm({
         title: 'logout confirm',
         template: 'Are you sure you want to logout?'
       });
       confirmPopup.then(function(res) {
         if(res) {
           $scope.global.token=-1;
           $scope.global.user=angular.copy(anonymous);
           $scope.modal.hide();
		   console.log("ano"+anonymous.profile.username);
		   console.log('finish logout')
         } else {
           console.log('You are not sure');
         }
       });
     };

	$scope.changePwd=function(){
		if($scope.global.user.isAnonymous) { $scope.openLoginModal();return;}
		$ionicPopup.show({
			title: 'change password',
			template: '<input class="padding" type="password" ng-model="dataPwd.oldPwd" placeholder="enter old password" required><br/>'
			+'<input class="padding"  type="password" ng-model="dataPwd.newPwd" placeholder="enter new password"required><br/>'
			+'<input class="padding" type="password" ng-model="newPwdre.v" placeholder="confirm new password" required> ',
			scope: $scope,
			buttons: [
				{	text: 'cancel' },
				{	text: 'confirm',
					type: 'button-positive',
					onTap: function() {
						console.log('dataPwd:');
						console.log($scope.dataPwd);
						console.log('pwere:'+$scope.newPwdre.v);
						if ($scope.dataPwd.oldPwd == undefined) {
							$scope.showAlert("Oops", "please enter your password!");
							return;
						}
						if ($scope.dataPwd.newPwd.length < 6) {
							$scope.showAlert("Oops", "new password should be longer than 6 charactors!");
							return;
						}
						if ($scope.dataPwd.newPwd != $scope.newPwdre.v) {
							$scope.showAlert("Oops", "two new passwords do not match!");
							return;
						}
						$ionicLoading.show({
							animation:'faFde-out',
							showBackdrop: true,
					        template: '<div class="sk-spinner sk-spinner-chasing-dots"><div class="sk-dot1"></div><div class="sk-dot2"></div></div>',
						});
						$http.post(site_join('/accounts/change_pwd/'),{
							data:JSON.stringify($scope.dataPwd),
							token:$scope.global.token,
							pk_user:$scope.global.user.profile.pk
						})
						.success(function(data, status, headers, config) {
							//data=JSON.parse(data);
							$ionicLoading.hide();
							if(data.ok){
								$scope.showAlert("success","change password success!");
								
								$scope.global.token=-1;
								$scope.global.user=angular.copy(anonymous);
								$scope.modal.hide();
								$scope.openLoginModal();
								return;
							}
							else
								$scope.showAlert("Oops!","wrong password.");
						})
						.error(function(data, status, headers, config) {
							$ionicLoading.hide()
							$scope.showAlert("Oops!","Something wrong with it.");
							console.log(status);
						});
					}
				}
			]
		});
		
		
	}

})

.controller('FavCtrl', function($scope, $ionicModal, $templateCache, $ionicLoading) {
  
  $ionicModal.fromTemplateUrl('pages/favorites.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal
  })

  	$scope.data = {
		showDelete: false
	};

  $scope.openModal = function() {
    console.log('hello')
	$ionicLoading.show({
			animation:'fade-out',
			showBackdrop: true,
			template:'<div class="sk-spinner sk-spinner-chasing-dots"><div class="sk-dot1"></div><div class="sk-dot2"></div></div>',
		});
   $scope.modal.show();
   $ionicLoading.hide()
  }

  $scope.closeModal = function() {
    $scope.modal.hide()
  }

  $scope.$on('$destroy', function() {
    $scope.modal.remove()
  });
})

.controller('GuideCtrl', function($scope, $ionicModal, $templateCache) {

  $ionicModal.fromTemplateUrl('pages/guide.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal
  })

  $scope.openModal = function() {
    console.log('hello')

   $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide()
  }

  $scope.$on('$destroy', function() {
    $scope.modal.remove()
  });
})

.controller('NavCtrl', function() {

})

.controller('CreateCtrl', function($scope, $http, $ionicLoading, $ionicModal, $ionicActionSheet, $cordovaDatePicker,  $cordovaImagePicker, $cordovaFileTransfer, ngProgress, $ionicPopup, ngProgress) {
    $scope.e={
        Quota:2,
        Price:50,
        Start_Time:new Date()
    }
	
	$scope.loading = false;
	
    $scope.imgURI='img/upload.svg';
    //$scope.printScope();

    //datepicker option
    var options = {
    date: new Date(),
    mode: 'date', // or 'time'
    minDate: new Date() - 10000,
    allowOldDates: true,
    allowFutureDates: false,
    doneButtonLabel: 'done',
    doneButtonColor: '#33cc99',
    cancelButtonLabel: 'cancel',
    cancelButtonColor: '#000000'
  };


    //TODO  用户先填写时间后，日期会自动变成1970年

    $scope.addQuota=function(){ $scope.e.Quota++; }
    $scope.minusQuota=function(){ if($scope.e.Quota>2)$scope.e.Quota--; }

    $scope.changeDate=function(){
        console.log("call change date");
         $cordovaDatePicker.show().then(function(date){
        $scope.e.Start_Time=date;
    });
    };

    $scope.selectImage=function(){
        var options = {
            maximumImagesCount: 1,
            width: 800,
            height: 800,
            quality: 80
        };
        $cordovaImagePicker.getPictures(options)
        .then(function (results) {
            $scope.imgURI=results[0];
        }, function(err) {
            // Error
        }, function (progress) {
            // constant progress updates
        });
    }

    $scope.createfn=function(tag){
        $scope.e.actTags=tag;
		$scope.loading = true;
        $cordovaFileTransfer.upload(site_join('/appoints/create/'), $scope.imgURI,
                {params:{
                        data:JSON.stringify($scope.e),
                        pk_user:$scope.global.user.profile.pk,
                        token:$scope.global.token
                    }
                })
            .then(function(data) {
              ngProgress.complete();
			  $scope.loading = false;
              console.log(data);
              data=angular.fromJson(data.response);
               if(data.ok){
                    $scope.showAlert("congratulations!","create success");
                    $scope.closeCreateAppointModal();
                }
                else {
                  ngProgress.reset();
			  	  $scope.loading = false;
                  $scope.showAlert("Sorry","Something wrong with it, please try again. ");
                }
            }, function(err) {
            	ngProgress.reset();
			  	$scope.loading = false;
                $scope.showAlert('Oops!','Network error.');
            }, function (progress) {

            });

    }

    $scope.isValid=function(){
        return true;
    };
    $scope.submit=function(tag){
    if (!$scope.isValid()) return;
    // $ionicLoading.show({
    //   animation:'fade-out',
    //   showBackdrop: true,
    //   template: '<div class="sk-spinner sk-spinner-chasing-dots"><div class="sk-dot1"></div><div class="sk-dot2"></div></div>',
    //   });
    ngProgress.start();
    $scope.createfn(tag);
    console.log("do submit");
    };

	$scope.showConfirm = function() {
		console.log('called');
    	var confirmPopup = $ionicPopup.confirm({
     		title: 'exit edit',
     		template: 'are you sure you want to give up this template?'
   		});
   		confirmPopup.then(function(res) {
     		if(res) {
     			ngProgress.reset();
       			$scope.closeCreateAppointModal();
     		}
   		});
 	};
	
})

/////-------------------------------------
//infinite scroll
//TODO  bug  在拉到最后请求返回为[] 时，会由于位置问题，无限调用刷新函数，将布局上拉能停止调用
//  $scope.items = [];
//  $scope.loadMore = function() {
//    console.log("do load");
//    $timeout(function() { $scope.$apply(function(){ $timeout(function() { $scope.$broadcast('scroll.infiniteScrollComplete');  }); });});
    // $http.get(site_join('/appoints/'),{data:$scope.req,csrfmiddlewaretoken:$cookies.csrftoken},
    //     {headers : {"Cookie" : "csrftoken="+$cookies.csrftoken}})
    // .success(function(data, status, headers, config) {
    //   //data=JSON.parse(data);
    //   console.log(data);
    //     if(data.ok){
    //         data=data.data;
    //         console.log($scope.events);
    //         if(data!=[]){
    //             if($scope.events!=[]) $scope.events=$scope.events.concat(data);
    //             else $scope.events=data;
    //         }
    //     }

    // })
    // .error(function(data, status, headers, config) {

    // });
    
//  };

// })
/////-----------------

.controller('EventCtrl', function($scope, $ionicPopup, $http, $ionicActionSheet) {	
	
	$scope.share = function(item) {
		$scope.todo();
		return;
		$ionicActionSheet.show({
			buttons: [
				{ text: 'wechat'}
			],
			titleText: 'share to',
			cancelText: 'Cancel',
			buttonClicked: function(index) {
			return true;
			}
		});  
	};
  
	$scope.addtoFav = function() {
		$scope.todo();
		return;
		$scope.data = {}

		// An elaborate, custom popup
		var myPopup = $ionicPopup.show({
			title: 'liked!',
			template: '<p class="text-center">also saved in favorites!</p> <div class="favoimg"></div> ',
			scope: $scope,
			buttons: [
				{ text: 'ok' },
			]
		});
		myPopup.then(function(res) {
			console.log('add to fav!', res);
		});
	};

	$scope.join = function() {
		if ($scope.global.user.isAnonymous){
			console.log('anon');
			$scope.showAlert("Oops","please login first!");
			$scope.openLoginModal();
		}else if ($scope.detailItem.ApptID == undefined){
			
		}else{
			console.log('apptID:'+$scope.detailItem.ApptID);
			var confirmPopup = $ionicPopup.confirm({
				showBackdrop: false,
				title: 'joint us!',
				template: '<p class="text-center">That would be nice!</p> <div class="joinoimg"></div>'
			});
			confirmPopup.then(function(res) {
				if(res) {
					console.log('You are sure');
					$http.post(site_join('/appoints/join/'+$scope.detailItem.ApptID+'/'),
					{
						pk_user:$scope.global.user.profile.pk,
						token:$scope.global.token
					})
					.success(function(data, status, headers, config) {
						if (data.ok) {
							$scope.showAlert("Join success!","Congratulations");
							console.log('here');
							$scope.closeDetailModal();
							//$scope.openDetailModal();
						}else{
							$scope.showAlert("Oops", "no vancacy left!");
						}
					})
					.error(function(){ $scope.showAlert("Oops!!","network error.");});
				} 
				else { console.log('You are not sure'); }
			});
		};
	};

	$scope.showVacancy = function() {
		$scope.data = {}

  // An elaborate, custom popup
		var myPopup = $ionicPopup.show({
			template: '<ion-list>' +
					'<ion-item ng-repeat="u in detailItem.attenders" class="item-avatar item-icon-left">' +
					'<img src="{{addr(u.Avatar)}}" class="useruserimg">' +
					'<h2 style="margin-top:10px; margin-left:4px;">{{u.NickName}}</h2>' +
					'</ion-item>' +
					'</ion-list>',
			title: 'participants( '+$scope.detailItem.attenders.length + ')',
			scope: $scope,
			buttons: [
				{ text: 'ok' },
			]
		});
		myPopup.then(function(res) {
			console.log('Tapped!', res);
		});

	};

	$scope.showCountdown = function() {
		$scope.data = {}
		var EndTime= new Date('2015/09/1 10:00:00'); 
		var NowTime = new Date();
		var t =EndTime.getTime() - NowTime.getTime();
		/*var d=Math.floor(t/1000/60/60/24);
		t-=d*(1000*60*60*24);
		var h=Math.floor(t/1000/60/60);
		t-=h*60*60*1000;
		var m=Math.floor(t/1000/60);
		t-=m*60*1000;
		var s=Math.floor(t/1000);*/

		var d=Math.floor(t/1000/60/60/24);
		var h=Math.floor(t/1000/60/60%24);
		var m=Math.floor(t/1000/60%60);
		var s=Math.floor(t/1000%60);
		// An elaborate, custom popup
		var myPopup = $ionicPopup.show({
			template: d+' days  '+h+' hours  '+m+' minutes  '+s+' seconds',
			title: 'kicking off in',
			scope: $scope,
			buttons: [
				  { text: 'ok'},
			]
		});
		myPopup.then(function(res) {
			console.log('Tapped!', res);
		});
		
	};
	
})

.controller('ListCtrl', function($scope, $filter, $http, $timeout) {
	$scope.events=$scope.global.events||[];
	console.log($scope.events);
	$scope.data = {
		showDelete: false
	};
	
	$scope.tags = {
		eat: true,
		travel: true,
		sports: true,
		study: true
	}

	$scope.tagsInfo= function(tag){
		if(tag=='H') return 'travel';
		else if (tag=='S') return 'sports';
		else if (tag=='A') return 'study';
		else if (tag=='E') return 'eat';
		else return 'other';
	};

	$scope.canGetMore=true;

	$scope.onItemDelete = function(item) {
	//	console.log('call onItemDelete. item index:'+$scope.items.indexOf(item));
		$scope.historyEvents.splice($scope.historyEvents.indexOf(item), 1);
	};
  //TODO
	$http.post(site_join('/appoints/'),{
		data:JSON.stringify({
							Refresh: 'middle',
							//filter: {ifClosed: false}
							})
	})
		.success(function(data, status, headers, config){
			//data=JSON.parse(data);
			if(data.ok) {
				$scope.events=data.events;
				$scope.global.events=$scope.events.slice(0,5);
			}
		})
		.error(function(data, status, headers, config){
		});
    
	$scope.condition=function(value){
		t=['A','H','S','E'].filter(function(item,index){return $scope.tags[['eat', 'travel', 'sports', 'study'][index]];});
		return t.indexOf(value.actTags)!=-1;
	};

	$scope.doRefresh = function() {
		console.log($scope.tags);
		$scope.moreDataCanBeLoaded=true;
		console.log($scope.events);
		$scope.req={
			Refresh:'top',
			filter:{
				//ifClosed:false,
				actTags:['A','H','S','E'].filter(function(item,index){return $scope.tags[['eat', 'travel', 'sports', 'study'][index]];}),
			},
			ApptID:(!$scope.events.length)?'':$scope.events[0].ApptID
		};

		$http.post(site_join('/appoints/top_refresh/'),{data:JSON.stringify($scope.req)})
			.success(function(data, status, headers, config){
				//data=JSON.parse(data);
				if(data.ok){
					if(data.refresh) $scope.events=data.events;
					else $scope.events=data.events.concat($scope.events);
					$scope.global.events=$scope.events.slice(0,5);
				}
				else $scope.showAlert("Oops!","internet error");
			});
			$scope.$broadcast('scroll.refreshComplete');
			$scope.$apply();
	};

	//infinite scroll
	$scope.loadMore = function() {
		console.log("do load");
		console.log($scope.events);
		$scope.req={
			Refresh:'bottom',
			filter:{
				//ifClosed:false,
				actTags:['E','H','S','A'].filter(function(item,index){return $scope.tags[['eat', 'travel', 'sports', 'study'][index]];}),
			},
			ApptID:(!$scope.events.length)?'':$scope.events[$scope.events.length-1].ApptID
		};

		//$timeout(function() { $scope.$apply(function(){ $timeout(function() { $scope.$broadcast('scroll.infiniteScrollComplete');  }); });});
		if(!$scope.canGetMore) {$scope.$broadcast('scroll.infiniteScrollComplete'); return;}
		$scope.canGetMore=false;
		$http.post(site_join('/appoints/bottom_refresh/'),{data:JSON.stringify($scope.req)})
			.success(function(data, status, headers, config) {
				//data=JSON.parse(data);
				console.log(data);
				if(data.ok){
					data=data.events;
					console.log($scope.events);
					if(data!=[]){
						if($scope.events!=[]) $scope.events=$scope.events.concat(data);
						else $scope.events=data;
						$scope.global.events=$scope.events.slice(0,5);
					}
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.canGetMore=true;
			})
			.error(function(data, status, headers, config) {
				$scope.canGetMore=true;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});

		$scope.$on('$stateChangeSuccess', function() {
			$scope.loadMore();
		});

	};


})
.controller('FriCtrl', function($scope, $ionicPopup) {
 $scope.unfriend = function() {
  $scope.data = {}

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    showBackdrop: false,
    title: 'oops',
    template: '<p class="text-center">you wanna unfriend this guy?</p><div class="qaqimg"></div>',
    scope: $scope,
    buttons: [
      { text: 'no',
        type: 'button-positive'  },
      { text: 'countinue' }      
    ]    
  });
  myPopup.then(function(res) {
    console.log('去chat', res);
  });
};

})

.controller('LoginCtrl', function($scope, $http, $ionicLoading, $ionicModal, $ionicPopup, $templateCache) {
	$scope.loading = false;
	
	$scope.loginData={
		username:'',
		password:'',
	};

	$scope.loginfn=function(){
		$scope.loading = true;
		/*$ionicLoading.show({
			animation:'faFde-out',
			showBackdrop: true,
			template: '<ion-spinner class="spinner-energized"></ion-spinner><p class="col">loading</p>',
		});*/
		$http.post(site_join('/accounts/login/'),{data:JSON.stringify($scope.loginData)})
			.success(function(data, status, headers, config) {
				$scope.loading = false;
				//data=JSON.parse(data);
				if(data.ok){
					if(!data.profile.is_active) {
						$ionicPopup.show({
							template: 'Please activate your account via Email confirmation first!',
							title: 'Oops',
							scope: $scope,
							buttons: [
								{	text: 'Cancel' },
								{
									text: 'Resend',
									type: 'button-positive',
									onTap: function( ) {
										$ionicLoading.show({
											animation:'fade-out',
											showBackdrop: true,
											template:'<div class="sk-spinner sk-spinner-chasing-dots"><div class="sk-dot1"></div><div class="sk-dot2"></div></div>',
										});
										$http.get(site_join('/resend/'+data.profile.pk+'/'))
											.success(function(data, status, headers, config){
												//data=JSON.parse(data);
												$ionicLoading.hide();
                        
											})
											.error(function(data, status, headers, config){
												$scope.showAlert("Oops!","Network error.");
												$ionicLoading.hide();
											});
                  
									}
								}
							]
						});
						return;
					}
					$scope.global.token=data.token;
					$scope.global.user.profile=data.profile;
					$scope.global.user.isAnonymous=false;
					//$localStorage={token:'11'};
					//$scope.$apply();
					//console.log($localStorage);
					console.log("next is:");
					console.log($scope.next);
					//$scope.printScope();
					if($scope.next!=undefined) {
						console.log("call next");
						$scope.next(); 
					}
					$scope.closeLoginModal();
				} else{
					$scope.showAlert(data.msg,"Please try again!");
				}
			})
			.error(function(data, status, headers, config) {
				$scope.loading = false;
				if (status == '404') {
					$scope.showAlert("Oops","your account does not exist!");
				}else if (status == '401') {
					$scope.showAlert("Oops","wrong password! please try again!");
				} else {
					$scope.showAlert("Oops","something wrong! please try again!");
				}
				
			})
	}
	$scope.submit=function(){
    
		console.log(JSON.stringify($scope.loginData));
		$scope.loginfn();
		console.log("do submit");

	};
	
	$scope.forgetPwd = function(ID){
		console.log('do forgetPwd');
		console.log('id:'+ID);
		//$scope.loading = true;
		$scope.loading = true;
		$http.get(site_join('/accounts/forget_pwd/'+ID+'/'),{})
			.success(function(data, status, headers, config) {
				$scope.loading = false;
				if(data.ok){
					$scope.showAlert("success","An email has been sent to you, please check your inbox.");
					$scope.closeForgottenModal();
					$scope.openLoginModal();
				}else{
					$scope.showAlert("Oops","Something wrong. Please try again!");
				}
			})
			.error(function(data, status, headers, config) {
				$scope.loading = false;
				if(status==404)  $scope.showAlert("error","the account does not exist!");
				else $scope.showAlert("Oops","Network error.");
				console.log(status);
			});
	}
	
})

.controller('RegisterCtrl', function($scope, $http, $ionicModal, $ionicLoading, $templateCache, $ionicSlideBoxDelegate, $timeout, $ionicPopup) {
	$scope.loading = false;
	$scope.u={};
	$scope.pwdre={};
	$scope.regfn = function(){
		$scope.loading = true;
		/*$ionicLoading.show({
			animation:'fade-out',
			showBackdrop: true,
			template: '<div class="sk-spinner sk-spinner-chasing-dots"><div class="sk-dot1"></div><div class="sk-dot2"></div></div>',
		});*/
		console.log('pwdre:'+$scope.pwdre.v);
		$http.post(site_join('/accounts/register/'),{data:JSON.stringify($scope.u)})
			.success(function(data, status, headers, config) {
				$scope.loading = false;
				//data=JSON.parse(data);
				if(data.ok){
					$scope.showAlert("only one step remains!","A confirm mail has been sent to you, please check your inbox.");
					$scope.closeRegisterModal();
				}else{
					$scope.showAlert("Oops","Something wrong. Please try again!");
				}
			})
			.error(function(data, status, headers, config) {
				//$ionicLoading.hide();
				$scope.loading = false;
				if(status==403)  $scope.showAlert("Oops","user already exist.");
				else $scope.showAlert("Oops","Network error.");
				console.log(status);
			});
	}
	$scope.submit=function(){
		console.log(JSON.stringify($scope.u));
		$scope.regfn();
		console.log("do submit");
	}

})

.controller('ImageCtrl', function($scope, $ionicModal, $templateCache) {

  $ionicModal.fromTemplateUrl('pages/image.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal
  })

  $scope.openModal = function() {
    console.log('hello')

   $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide()
  }

  $scope.$on('$destroy', function() {
    $scope.modal.remove()
  });
})

.controller('MapCtrl', function($scope, $ionicLoading, $compile) {
    $scope.initialize = function() {  
               var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
        
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Uluru (Ayers Rock)'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;
        console.log("success");
            };  

      //google.maps.event.addDomListener(window, 'load', initialize);
      
      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      
      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };
      
});
/*app.directive('pwCheck',function(){
	 return{
		 require: 'ngModel',
		 link: function(scope, elem, attrs, ctrl){
			 console.log('okthere');
			 var pw = '#' + attrs.name;
			 var pwcon = '#' + attrs.pwCheck;
			 console.log(elem);
			 elem.add(pw).on('mouthout', function(){
			 		scope.$apply(function(){
							ctrl.$setValidity('pwmatch', $(pwcon).val() === $(pw).val());
					});
			 });
		 }
	 }
});*/
