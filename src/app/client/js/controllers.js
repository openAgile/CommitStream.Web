'use strict';

var commitStreamAdminControllers = angular.module('commitStreamAdminControllers', []);

var isInstanceMode = function(config) {
  if (!config.configMode) return true;
  return config.configMode.type === 'instance';
};

var isDigestMode = function(config) {
  return config.configMode && config.configMode.type === 'digest';
};

var isDigestConfigured = function(config) {
  return config.configMode.configured;
};

commitStreamAdminControllers.controller('InstancesController', [
  '$rootScope',
  '$scope',
  '$http',
  '$q',
  '$location',
  'CommitStreamApi',
  'serviceUrl',
  'configGetUrl',
  'configSaveUrl',
  'persistentOptions',
  function($rootScope, $scope, $http, $q, $location, CommitStreamApi, serviceUrl, configGetUrl, configSaveUrl, persistentOptions) {
    var config;

    $scope.loaderUrl = serviceUrl + '/ajax-loader.gif';

    var loading = true;

    $scope.loading = function() {
      return loading;
    };

    var errorHandler = function(error) {
      loading = false;
      if (error.data && error.data.errors && error.data.errors.length) {
        $scope.error.value = error.data.errors[0];
      } else {
        $scope.error.value = 'There was an unexpected error when processing your request.';
      }
    };

    $scope.error = {
      value: ''
    };

    $scope.errorActive = function() {
      return $scope.error.value !== '';
    };


    CommitStreamApi
      .load()
      .then(function(resources) {
        $rootScope.resources = resources;
        if (!configGetUrl) return {
          data: {
            configMode: {
              type: 'instance',
              digestId: '',
              configured: false,
              enabled: false,
              useGlobalDigestId: false
            },
            serviceUrl: serviceUrl,
            instanceId: '',
            apiKey: '',
            globalDigestId: '',
            configured: false,
            enabled: false
          }
        }
        return $http.get(configGetUrl);
      })
      .then(function(configRes) {
        // TODO handle null case?
        config = configRes.data;
        $rootScope.config = config;

        if (config.configured) {
          persistentOptions.headers.Bearer = config.apiKey;
          return $rootScope.resources.$get('instance', {
            instanceId: config.instanceId
          });
        } else {
          // return $rootScope.resources.$post('instances');
          return false;
        }
      })
      .then(function(instance) {
        if (instance) {
          persistentOptions.headers.Bearer = instance.apiKey; // Ensure apiKey for NEW instance
          $rootScope.instance = instance;

          if (isInstanceMode(config)) {
            if (config.configured) {
              return $rootScope.resources.$get('digest', {
                instanceId: config.instanceId,
                digestId: config.globalDigestId
              });
            } else {
              return instance.$post('digest-create', {}, {
                description: 'Global Repositories List'
              });
            }
          } else if (isDigestMode(config)) {
            if (isDigestConfigured(config)) {
              // return $rootScope.resources.$get('digest', {
              //   instanceId: config.instanceId,
              //   digestId: config.configMode.digestId
              // });
            } else {
              // return instance.$post('digest-create', {}, {
              //   description: 'Repositories List'
              // });
            }
          } else {
            // Don't know what state it's in here, but probably didn't get here naturally, so just return false
            return false;
          }
        }
      })
      .then(function(digest) {
        if (digest) {
          $rootScope.digest = digest;
          // Check if we are in digestMode and need to save
          if (isDigestMode(config) && !isDigestConfigured(config)) {
            //   config.configMode.digestId = digest.digestId;
            //   configDigestModeSave(config.configMode)
            //     .then(function(configModeSaveResult) {
            //       $location.path('/inboxes');
            //     })
            //     .catch(errorHandler);
          } else {
            $location.path('/inboxes');
          }
        } else {
          $location.path('/inboxes');
        }
      })
      .catch(errorHandler);
  }
]);

commitStreamAdminControllers.controller('InboxesController', [
  '$rootScope',
  '$scope',
  '$timeout',
  'serviceUrl',
  'configSaveUrl',
  '$http',
  '$q',
  'prompt',
  '$location',
  'persistentOptions',
  function($rootScope, $scope, $timeout, serviceUrl,
    configSaveUrl, $http, $q, prompt, $location, persistentOptions) {

    $scope.inboxesVisible = function() {
      // Only display when we actually have the config in $scope!
      return $rootScope.config;
    };

    var isCustomDigest = function() {
      return $scope.digestConfig.selection === 'useCustomDigest';
    };

    var isGlobalDigest = function() {
      return $scope.digestConfig.selection === 'useGlobalDigest';
    }

    var getGlobalDigest = function(config) {
      if (isDigestConfigured(config)) {
        return $rootScope.resources.$get('digest', {
          instanceId: $rootScope.config.instanceId,
          digestId: $rootScope.config.globalDigestId
        })
      } else {
        //IS THERE A CASE FOR THIS?
      }
    }
    var getCustomDigest = function(config) {
      if (!isDigestConfigured(config)) {
        return $rootScope.instance.$post('digest-create', {}, {
          description: 'Repositories List'
        }).then(function(digest) {
          return {
            digest: digest,
            created: true
          }
        });
      } else {
        return $rootScope.resources.$get('digest', {
          instanceId: $rootScope.config.instanceId,
          digestId: $rootScope.config.configMode.digestId
        }).then(function(digest) {
          return {
            digest: digest,
            created: false
          }
        });
      }
    }

    // For teamroom settings:
    var configDigestModeSave = function(configMode) {
      //check the config object the first time.
      if (configSaveUrl) return $http.post(configSaveUrl, configMode);
      return $q.when(true);

    };

    var customDigestSelected = function(firstCall) {
      getCustomDigest($rootScope.config).then(function(digestResponse) {
        $rootScope.digest = digestResponse.digest;
        $rootScope.config.configMode.digestId = digestResponse.digest.digestId;
        $rootScope.config.configMode.useGlobalDigestId = false;
        $rootScope.config.configMode.enabled = true;
        if (!firstCall) configDigestModeSave($rootScope.config.configMode);
        if (!digestResponse.created) inboxesUpdate($rootScope.config.enabled);
      });
    }
    var globalDigestSelected = function(firstCall) {
      getGlobalDigest($rootScope.config).then(function(digest) {
        $rootScope.digest = digest;
        $rootScope.config.configMode.useGlobalDigestId = true;
        $rootScope.config.configMode.enabled = true;
        if (!firstCall) configDigestModeSave($rootScope.config.configMode);
        inboxesUpdate($rootScope.config.enabled);
      })
    }

    var disabledDigestSelected = function() {
      $rootScope.config.configMode.useGlobalDigestId = false;
      $rootScope.config.configMode.enabled = false;
      configDigestModeSave($rootScope.config.configMode);
    }

    $scope.magicWorks = function(value) {
      if (isCustomDigest()) {
        customDigestSelected(false);
      } else {
        if (isGlobalDigest()) {
          globalDigestSelected(false);
        } else {
          disabledDigestSelected();
        }
      }

    }

    $scope.inboxesVisible2 = function() {
      return $scope.config.configMode.type === 'instance' || $scope.digestConfig.selection !== 'disabled';
    };

    $scope.editAllowed = function() {
      return $scope.config.configMode.type === 'instance' || $scope.digestConfig.selection === 'useCustomDigest';
    };

    $scope.getHeading = function() {
      if ($scope.isInstanceMode()) return 'Setup Global Repositories';
      if ($scope.isDigestMode()) return isCustomDigest() ? 'Setup TeamRoom Repositories' : 'Active Global Repositories';
    };

    if (!$rootScope.config) {
      $location.path('/');
      return;
    }

    $scope.newInbox = {
      url: '',
      name: '',
      family: 'GitHub' // Until we support other systems, hard-code this.
    };

    $scope.serviceUrl = serviceUrl;
    $scope.inboxes = [];

    $scope.enabledState = {
      enabled: $rootScope.config.enabled,
      applying: false,
      onText: 'Enabled',
      offText: 'Disabled'
    };

    $scope.message = {
      value: ''
    };

    $scope.messageActive = function() {
      return $scope.message.value !== '';
    };

    $scope.error = {
      value: ''
    };

    $scope.errorActive = function() {
      return $scope.error.value !== '';
    };

    // NOTE: this is a bit of a hack to remove errors upon network request to clear
    // out the UI prompts
    persistentOptions.transformUrl = function(url) {
      $scope.error.value = '';
      return url;
    };

    $scope.urlPattern = /^https?\:\/\/.{1,}\/.{1,}$/;

    $scope.digestConfig = {
      selection: 'disabled'
    };

    var getSelection = function() {
      if ($rootScope.config.configMode.enabled) {
        if (!$rootScope.config.configMode.useGlobalDigestId) {
          $scope.digestConfig.selection = 'useCustomDigest';
          customDigestSelected(true);
        } else {
          $scope.digestConfig.selection = 'useGlobalDigest'
          globalDigestSelected(true);
        }
      }
    }
    getSelection();


    $scope.inboxName = function() {
      if (!$scope.newInbox.url || $scope.newInbox.url.length < 1) return '...';
      var index = $scope.newInbox.url.lastIndexOf('/');
      if (index < 0) return '...';
      if (index === $scope.newInbox.url.length - 1) return '...';
      return $scope.newInbox.url.substr(index + 1);
    };

    var errorHandler = function(error) {
      if (error.data && error.data.errors && error.data.errors.length) {
        $scope.error.value = error.data.errors[0];
      } else {
        $scope.error.value = 'There was an unexpected error when processing your request.';
      }
    };

    var configSave = function(enabled) {
      $rootScope.config.enabled = enabled;

      if (!$rootScope.config.configured) {
        return $rootScope.resources.$post('instances')
          .then(function(instance) {
            persistentOptions.headers.Bearer = instance.apiKey; // Ensure apiKey for NEW instance
            $rootScope.instance = instance;
            return instance.$post('digest-create', {}, {
              description: 'Global Repositories List'
            });
          })
          .then(function(digest) {
            $rootScope.digest = digest;
            $rootScope.config.instanceId = $rootScope.instance.instanceId;
            $rootScope.config.globalDigestId = digest.digestId;
            $rootScope.config.apiKey = $rootScope.instance.apiKey;
            $rootScope.config.configured = true;
            if (configSaveUrl) return $http.post(configSaveUrl, $rootScope.config);
            return $q.when(true);
          });
      } else {
        if (configSaveUrl) return $http.post(configSaveUrl, $rootScope.config);
        return $q.when(true);
      }
    };

    var inboxConfigure = function(inbox) {
      var links = inbox.$links();
      inbox.addCommit = links['add-commit'].href + '?apiKey=' + persistentOptions.headers.Bearer;
      inbox.removeHref = links['self'].href + '?apiKey=' + persistentOptions.headers.Bearer;
    };

    var inboxesGet = function() {
      if ($rootScope.digest) {
        $rootScope.digest.$get('inboxes')
          .then(function(inboxesRes) {
            return inboxesRes.$get('inboxes');
          }).then(function(inboxes) {
            $scope.inboxes.length = 0;
            inboxes.forEach(function(inbox) {
              inboxConfigure(inbox);
              $scope.inboxes.unshift(inbox);
            });
          })
          .catch(errorHandler);
      }
    };

    var inboxesUpdate = function(enabled) {
      if (enabled) {
        $timeout(function() {
          $('.inbox-url').select().focus();
        });
      }
      inboxesGet();
    }

    inboxesUpdate($rootScope.config.enabled);

    $scope.isInstanceMode = function() {
      return isInstanceMode($rootScope.config);
    };

    $scope.isDigestMode = function() {
      return isDigestMode($rootScope.config);
    };

    $scope.enabledChanged = function() {
      $scope.newInbox.url = '';

      var toggle = $('.commitstream-admin .enabled');

      var enabled = toggle.prop('checked');

      $scope.enabledState.applying = true;
      toggle.bootstrapToggle('disable');

      configSave(enabled).then(function(configSaveResult) {
        // TODO need to handle configSaveResult?
        inboxesUpdate(enabled);
      })
        .catch(errorHandler)
        .finally(function() {
          $scope.enabledState.applying = false;
          toggle.bootstrapToggle('enable');
        });
    };

    $scope.applying = function() {
      return $scope.enabledState.applying;
    };

    $scope.overlayVisible = function() {
      return $scope.enabledState.applying || !$rootScope.config.enabled;
    };

    $scope.adjustOverlay = function() {
      var repolistWidth = $('.repos-list').width();
      var repolistHeight = $('.repos-list').height();
      $('.repos-section .overlay').height(repolistHeight);
      $('.repos-section .overlay').width(repolistWidth);
    };

    // A jQuery based way of handling resizing of the window to adjust the overlay
    // when CS is disabled.
    // $(window).resize(function(){
    //   $scope.adjustOverlay();
    // });

    $scope.inboxCreating = false;

    $scope.inboxCreate = function() {
      //TODO: put the first 3 lines after the try in a promise
      try {
        $scope.inboxCreating = true;
        var index = $scope.newInbox.url.lastIndexOf('/');
        $scope.newInbox.name = $scope.newInbox.url.substr(index + 1);

        $rootScope.digest.$post('inbox-create', {}, $scope.newInbox)
          .then(function(inbox) {
            inboxConfigure(inbox);
            $scope.inboxes.unshift(inbox);
            $scope.newInbox.url = '';
            $scope.inboxHighlightTop(inbox.removeHref);
          })
          .catch(errorHandler)
          .finally(function() {
            $scope.inboxCreating = false;
          });
      } catch (e) {
        $scope.inboxCreating = false;
      }
    };

    $scope.inboxRemove = function(inbox) {
      prompt({
        title: 'Remove Repository?',
        message: 'Are you sure you want to remove the repository ' + inbox.name + '?',
        buttons: [{
          label: 'Remove',
          primary: true,
          class: 'action-remove'
        }, {
          label: 'Cancel',
          cancel: true,
          class: 'action-cancel'
        }]
      }).then(function() {
        inbox.$del('self').then(function(result) {
          $scope.message.value = 'Successfully removed repository';
          var index = $scope.inboxes.indexOf(inbox);
          $scope.inboxes.splice(index, 1);
          $timeout(function() {
            $('.commitstream-admin .message').fadeOut('slow', function() {
              $scope.message.value = '';
            });
          }, 4000);
        })
          .catch(errorHandler);
      });
    };

    var inboxHighlight = function(el) {
      if ($rootScope.config.enabled) {
        el.focus();
        el.select();
      }
    };

    $scope.inboxHighlight = function(evt) {
      inboxHighlight(evt.currentTarget);
    };

    $scope.inboxHighlightTop = function() {
      $timeout(function() {
        var el = $($('.commitstream-admin .inbox')[0]);
        inboxHighlight(el);
      }, 0);
    };

  }
]);