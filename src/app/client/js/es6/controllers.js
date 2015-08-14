(() => {
  let commitStreamControllers = angular.module('commitStreamControllers', []);

  commitStreamControllers.controller('CommitStreamAdminController', [
    '$scope',
    'CommitStreamApi',
    '$timeout',
    'serviceUrl',
    'configGetUrl',
    'configSaveUrl',
    '$http',
    '$q',
    'prompt',
    '$location',
    'persistentOptions', ($scope, CommitStreamApi, $timeout, serviceUrl, configGetUrl, configSaveUrl, $http, $q, prompt, $location, persistentOptions) => {

      let loading = true,
        config,
        resources,
        instance,
        digest;

      $scope.loaderUrl = serviceUrl + '/ajax-loader.gif';

      $scope.loading = () => loading;

      let errorHandler = error => {
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

      $scope.errorActive = () => $scope.error.value !== '';

      let isDigestConfigured = config => config.configMode.configured;

      // Only display when we actually have the config in $scope!
      $scope.isAdminPanelVisible = () => config && (instance || !config.configured);

      let isCustomDigest = () => $scope.digestConfig.selection === 'useCustomDigest';

      let isGlobalDigest = () => $scope.digestConfig.selection === 'useGlobalDigest';

      let getGlobalDigest = (config) => resources.$get('digest', {
        instanceId: config.instanceId,
        digestId: config.globalDigestId
      });

      let getCustomDigest = config => {
        if (!isDigestConfigured(config)) {
          return instance.$post('digest-create', {}, {
            description: 'Repositories List'
          }).then(digest => {
            return {
              digest,
              created: true
            };
          });
        } else {
          return resources.$get('digest', {
            instanceId: config.instanceId,
            digestId: config.configMode.digestId
          }).then(digest => {
            return {
              digest,
              created: false
            };
          });
        }
      };

      // For teamroom settings:
      let configDigestModeSave = configMode => {
        if (configSaveUrl) {
          return $http.post(configSaveUrl, configMode);
        }
        return $q.when(true);
      };

      let customDigestSelected = firstCall => {
        getCustomDigest(config).then(digestResponse => {
          digest = digestResponse.digest;
          config.configMode.digestId = digestResponse.digest.digestId;
          config.configMode.useGlobalDigestId = false;
          config.configMode.enabled = true;
          config.configMode.configured = true;
          if (!firstCall) configDigestModeSave(config.configMode);
          if (!digestResponse.created) inboxesUpdate(config.enabled);
        });
      };

      let globalDigestSelected = firstCall => {
        getGlobalDigest(config).then(_digest => {
          digest = _digest;
          config.configMode.useGlobalDigestId = true;
          config.configMode.enabled = true;
          if (!firstCall) configDigestModeSave(config.configMode);
          inboxesUpdate(config.enabled);
        })
      };

      let disabledDigestSelected = () => {
        config.configMode.useGlobalDigestId = false;
        config.configMode.enabled = false;
        configDigestModeSave(config.configMode);
      };

      let resetInboxes = () => {
        $scope.getInboxesDone = false;
        $scope.inboxes = [];
        resetFamily();
      };

      $scope.onOptionChange = value => {
        $scope.digestConfig.selection = value;
        resetInboxes();
        if (isCustomDigest()) {
          customDigestSelected(false);
        } else {
          if (isGlobalDigest()) {
            globalDigestSelected(false);
          } else {
            disabledDigestSelected();
          }
        }
      };

      $scope.radioButtonGlobal = () =>
        isGlobalDigest() ? 'glyphicon glyphicon-check' : 'glyphicon glyphicon-unchecked';

      $scope.radioButtonCustom = () =>
        isCustomDigest() ? 'glyphicon glyphicon-check' : 'glyphicon glyphicon-unchecked';

      $scope.radioButtonDisabled = () =>
        (!isCustomDigest() && !isGlobalDigest()) ? 'glyphicon glyphicon-check' : 'glyphicon glyphicon-unchecked';

      $scope.isInstanceMode = () =>
        !config.configMode ? true : config.configMode.type === 'instance';

      $scope.isDigestMode = () =>
        config.configMode && config.configMode.type === 'digest';

      $scope.areRepositoriesVisible = () =>
        $scope.isInstanceMode() || isGlobalDigest() || isCustomDigest();

      $scope.editAllowed = () => $scope.isInstanceMode() || isCustomDigest();

      $scope.getHeading = () => {
        if ($scope.isInstanceMode()) return 'Setup Global Repositories';
        if ($scope.isDigestMode()) {
          if (isCustomDigest()) {
            return 'Setup TeamRoom Repositories';
          } else return ($scope.inboxes.length > 0) ? 'Active Global Repositories' : 'Your administrator has not added any global repositories';
        }
      };

      let family = '';

      $scope.familySelect = newFamily => {
        family = newFamily;
        setupNewInbox(family);
      };

      $scope.familyIsSelected = familyName =>
        (family === familyName) ? 'family-selected' : '';

      $scope.familyHasBeenSelected = () => family !== '';

      $scope.familyIcon = familyName => `${serviceUrl}/icon-${familyName.toLowerCase()}-32x32.png`;

      let setupNewInbox = selectedFamily =>
        $scope.newInbox = {
          url: '',
          name: '',
          family: selectedFamily
        };

      let resetFamily = () => $scope.familySelect('');

      $scope.serviceUrl = serviceUrl;
      $scope.inboxes = [];
      $scope.getInboxesDone = false;

      $scope.message = {
        value: ''
      };

      $scope.messageActive = () => $scope.message.value !== '';

      // NOTE: this is a bit of a hack to remove errors upon network request to clear
      // out the UI prompts
      persistentOptions.transformUrl = url => {
        $scope.error.value = '';
        return url;
      };

      $scope.urlPattern = /^https?\:\/\/.{1,}\/.{1,}$/;

      $scope.digestConfig = {
        selection: 'disabled'
      };

      let getSelection = () => {
        if (config.configMode.enabled) {
          if (!config.configMode.useGlobalDigestId) {
            $scope.digestConfig.selection = 'useCustomDigest';
            customDigestSelected(true);
          } else {
            $scope.digestConfig.selection = 'useGlobalDigest'
            globalDigestSelected(true);
          }
        }
      };

      $scope.inboxName = () => {
        if (!$scope.newInbox.url || $scope.newInbox.url.length < 1) return '...';
        let index = $scope.newInbox.url.lastIndexOf('/');
        if (index < 0) return '...';
        if (index === $scope.newInbox.url.length - 1) return '...';
        return $scope.newInbox.url.substr(index + 1);
      };

      let configSave = enabled => {
        config.enabled = enabled;

        if (!config.configured) {
          return resources.$post('instances')
            .then(_instance => {
              instance = _instance;
              persistentOptions.headers.Bearer = instance.apiKey; // Ensure apiKey for NEW instance
              return instance.$post('digest-create', {}, {
                description: 'Global Repositories List'
              });
            })
            .then(_digest => {
              digest = _digest;
              config.instanceId = instance.instanceId;
              config.globalDigestId = digest.digestId;
              config.apiKey = instance.apiKey;
              config.configured = true;
              if (configSaveUrl) return $http.post(configSaveUrl, config);
              return $q.when(true);
            });
        } else {
          if (configSaveUrl) return $http.post(configSaveUrl, config);
          return $q.when(true);
        }
      };

      let inboxConfigure = inbox => {
        let links = inbox.$links();
        inbox.addCommit = links['add-commit'].href + '?apiKey=' + persistentOptions.headers.Bearer;
        inbox.removeHref = links['self'].href + '?apiKey=' + persistentOptions.headers.Bearer;
      };

      let inboxesGet = () => {
        if (digest) {
          digest.$get('inboxes')
            .then(inboxesRes => {
              return inboxesRes.$get('inboxes');
            }).then(inboxes => {
              $scope.inboxes.length = 0;
              inboxes.forEach(inbox => {
                inboxConfigure(inbox);
                $scope.inboxes.unshift(inbox);
              });
              if ($scope.inboxes.length > 0) {
                $scope.familySelect($scope.inboxes[0].family);
              }
            })
            .catch(errorHandler);
        }
        $scope.getInboxesDone = true;
      };

      let inboxesUpdate = enabled => {
        if (enabled) {
          $timeout(() => {
            $('.inbox-url').select().focus();
            allowTabNavigation();
          });
        } else {
          $timeout(() => {
            preventTabNavigation();
          });
        }
        inboxesGet();
      };

      $scope.enabledChanged = () => {
        $scope.newInbox.url = '';

        let toggle = $('.commitstream-admin .enabled');

        let enabled = toggle.prop('checked');

        $scope.enabledState.applying = true;
        toggle.bootstrapToggle('disable');

        configSave(enabled).then(configSaveResult => {
          // TODO need to handle configSaveResult?
          inboxesUpdate(enabled);
        })
          .catch(errorHandler)
          .finally(() => {
            $scope.enabledState.applying = false;
            toggle.bootstrapToggle('enable');
          });
      };

      let setupScope = () => {
        $scope.enabledState = {
          enabled: config.enabled,
          applying: false,
          onText: 'Enabled',
          offText: 'Disabled'
        };

        $scope.applying = () => $scope.enabledState.applying;

        $scope.overlayVisible = () => $scope.enabledState.applying || !config.enabled;

        setupNewInbox(family);
      };

      $scope.adjustOverlay = () =>
        $timeout(() => {
          let repolistHeight = $('.repos-list').height();
          $('.repos-section .overlay').height(repolistHeight);
        });

      $scope.inboxCreating = false;

      $scope.inboxCreate = () => {
        try {
          $scope.inboxCreating = true;
          let index = $scope.newInbox.url.lastIndexOf('/');
          $scope.newInbox.name = $scope.newInbox.url.substr(index + 1);

          digest.$post('inbox-create', {}, $scope.newInbox)
            .then(inbox => {
              inboxConfigure(inbox);
              $scope.inboxes.unshift(inbox);
              $scope.newInbox.url = '';
              $scope.inboxHighlightTop(inbox.removeHref);
            })
            .catch(errorHandler)
            .finally(() => {
              $scope.inboxCreating = false;
            });
        } catch (e) {
          $scope.inboxCreating = false;
        }
      };

      $scope.inboxRemove = inbox =>
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
        }).then(() => {
          inbox.$del('self').then(result => {
            $scope.message.value = 'Successfully removed repository';
            let index = $scope.inboxes.indexOf(inbox);
            $scope.inboxes.splice(index, 1);
            $timeout(() => {
              $('.commitstream-admin .message').fadeOut('slow', () => {
                $scope.message.value = '';
              });
            }, 4000);
          })
            .catch(errorHandler);
        });

      let inboxHighlight = el => {
        if (config.enabled) {
          el.focus();
          el.select();
        }
      };

      $scope.inboxHighlight = evt => inboxHighlight(evt.currentTarget);

      $scope.inboxHighlightTop = () =>
        $timeout(() => {
          let el = $($('.commitstream-admin .inbox')[0]);
          inboxHighlight(el);
        }, 0);

      let getConfig = _resources => {
        resources = _resources;
        if (!configGetUrl) return {
          data: {
            configMode: {
              type: 'instance',
              digestId: '',
              configured: false,
              enabled: false,
              useGlobalDigestId: false
            },
            serviceUrl,
            instanceId: '',
            apiKey: '',
            globalDigestId: '',
            configured: false,
            enabled: false
          }
        }
        return $http.get(configGetUrl);
      };

      let getInstance = configRes => {
        config = configRes.data;
        if (!config.configMode) {
          config.configMode = {
            type: 'instance',
            digestId: '',
            configured: false,
            enabled: false,
            useGlobalDigestId: false
          };
        }

        if (!config.configured) return false;

        persistentOptions.headers.Bearer = config.apiKey;
        return resources.$get('instance', {
          instanceId: config.instanceId
        });
      };

      let getDigest = _instance => {
        if (!_instance) return false;

        instance = _instance;
        persistentOptions.headers.Bearer = instance.apiKey; // Ensure apiKey for NEW instance

        if ($scope.isInstanceMode() && config.configured) {
          return resources.$get('digest', {
            instanceId: config.instanceId,
            digestId: config.globalDigestId
          });
        }

        if ($scope.isInstanceMode()) {
          return instance.$post('digest-create', {}, {
            description: 'Global Repositories List'
          });
        }
        // Don't know what state it's in here, but probably didn't get here naturally, so just return false
        return false;
      };

      let preventTabNavigation = () =>
        $("#commitStreamAdmin :input").each(function() {
          $(this).attr('tabindex', '-1');
        });

      let allowTabNavigation = () =>
        $("#commitStreamAdmin :input").each(function() {
          $(this).removeAttr('tabindex');
        });

      CommitStreamApi
        .load()
        .then(getConfig)
        .then(getInstance)
        .then(getDigest)
        .then(_digest => {
          if (_digest) digest = _digest;
          setupScope();
          if ($scope.isDigestMode()) getSelection();
          inboxesUpdate(config.enabled);
          loading = false;
        })
        .catch(errorHandler);
    }
  ]);
}());