'use strict';

(function () {
  var commitStreamControllers = angular.module('commitStreamControllers', []);

  commitStreamControllers.controller('CommitStreamAdminController', ['$scope', 'CommitStreamApi', '$timeout', 'serviceUrl', 'configGetUrl', 'configSaveUrl', '$http', '$q', 'prompt', '$location', 'persistentOptions', function ($scope, CommitStreamApi, $timeout, serviceUrl, configGetUrl, configSaveUrl, $http, $q, prompt, $location, persistentOptions) {

    var loading = true,
        config = undefined,
        resources = undefined,
        instance = undefined,
        digest = undefined;

    $scope.loaderUrl = serviceUrl + '/ajax-loader.gif';

    $scope.loading = function () {
      return loading;
    };

    var errorHandler = function errorHandler(error) {
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

    $scope.errorActive = function () {
      return $scope.error.value !== '';
    };

    var isDigestConfigured = function isDigestConfigured(config) {
      return config.configMode.configured;
    };

        // If we have the config, and an instance, but the instance isn't 
        // loaded, don't display yet:
        if (config && config.configured) {
          return instance;
        }
        // Otherwise, just check if we have the config yet:
      return config;
    };

    var isCustomDigest = function isCustomDigest() {
      return $scope.digestConfig.selection === 'useCustomDigest';
    };

    var isGlobalDigest = function isGlobalDigest() {
      return $scope.digestConfig.selection === 'useGlobalDigest';
    };

    var getGlobalDigest = function getGlobalDigest(config) {
      return resources.$get('digest', {
        instanceId: config.instanceId,
        digestId: config.globalDigestId
      });
    };

    var getCustomDigest = function getCustomDigest(config) {
      if (!isDigestConfigured(config)) {
        return instance.$post('digest-create', {}, {
          description: 'Repositories List'
        }).then(function (digest) {
          return {
            digest: digest,
            created: true
          };
        });
      } else {
        return resources.$get('digest', {
          instanceId: config.instanceId,
          digestId: config.configMode.digestId
        }).then(function (digest) {
          return {
            digest: digest,
            created: false
          };
        });
      }
    };

    // For teamroom settings:
    var configDigestModeSave = function configDigestModeSave(configMode) {
      if (configSaveUrl) {
        return $http.post(configSaveUrl, configMode);
      }
      return $q.when(true);
    };

    var customDigestSelected = function customDigestSelected(firstCall) {
      getCustomDigest(config).then(function (digestResponse) {
        digest = digestResponse.digest;
        config.configMode.digestId = digestResponse.digest.digestId;
        config.configMode.useGlobalDigestId = false;
        config.configMode.enabled = true;
        config.configMode.configured = true;
        if (!firstCall) configDigestModeSave(config.configMode);
        if (!digestResponse.created) inboxesUpdate(config.enabled);
      });
    };

    var globalDigestSelected = function globalDigestSelected(firstCall) {
      getGlobalDigest(config).then(function (d) {
        digest = d;
        config.configMode.useGlobalDigestId = true;
        config.configMode.enabled = true;
        if (!firstCall) configDigestModeSave(config.configMode);
        inboxesUpdate(config.enabled);
      });
    };

    var disabledDigestSelected = function disabledDigestSelected() {
      config.configMode.useGlobalDigestId = false;
      config.configMode.enabled = false;
      configDigestModeSave(config.configMode);
    };

    var resetInboxes = function resetInboxes() {
      $scope.getInboxesDone = false;
      $scope.inboxes = [];
    };

    $scope.onOptionChange = function (value) {
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

    $scope.radioButtonGlobal = function () {
      if (isGlobalDigest()) {
        return 'glyphicon glyphicon-check';
      } else {
        return 'glyphicon glyphicon-unchecked';
      }
    };

    $scope.radioButtonCustom = function () {
      if (isCustomDigest()) {
        return 'glyphicon glyphicon-check';
      } else {
        return 'glyphicon glyphicon-unchecked';
      }
    };

    $scope.radioButtonDisabled = function () {
      if (!isCustomDigest() && !isGlobalDigest()) {
        return 'glyphicon glyphicon-check';
      } else {
        return 'glyphicon glyphicon-unchecked';
      }
    };

    $scope.isInstanceMode = function () {
      if (!config.configMode) return true;
      return config.configMode.type === 'instance';
    };

    $scope.isDigestMode = function () {
      return config.configMode && config.configMode.type === 'digest';
    };

    $scope.areRepositoriesVisible = function () {
      return $scope.isInstanceMode() || isGlobalDigest() || isCustomDigest();
    };

    $scope.editAllowed = function () {
      return $scope.isInstanceMode() || isCustomDigest();
    };

    $scope.getHeading = function () {
      if ($scope.isInstanceMode()) return 'Setup Global Repositories';
      if ($scope.isDigestMode()) {
        if (isCustomDigest()) {
          return 'Setup TeamRoom Repositories';
        } else return $scope.inboxes.length > 0 ? 'Active Global Repositories' : 'Your administrator has not added any global repositories';
      }
    };

    var family = '';
    var showAllVcs = true;

    $scope.familySelect = function (newFamily) {
      showAllVcs = false;
      family = newFamily;
      setupNewInbox(family);
    };

    $scope.familyIsSelected = function (familyName) {
      var className = family === familyName && !showAllVcs ? 'family-selected' : '';
      return className;
    };

    $scope.familyIsVisible = function (familyName) {
      return familyName === family || showAllVcs;
    };

    $scope.allVcsVisible = function () {
      return showAllVcs;
    };

    $scope.showAllVcs = function () {
      showAllVcs = true;
    };

    var setupNewInbox = function setupNewInbox(selectedFamily) {
      $scope.newInbox = {
        url: '',
        name: '',
        family: selectedFamily
      };
    };

    $scope.serviceUrl = serviceUrl;
    $scope.inboxes = [];
    $scope.getInboxesDone = false;

    $scope.message = {
      value: ''
    };

    $scope.messageActive = function () {
      return $scope.message.value !== '';
    };

    // NOTE: this is a bit of a hack to remove errors upon network request to clear
    // out the UI prompts
    persistentOptions.transformUrl = function (url) {
      $scope.error.value = '';
      return url;
    };

    $scope.urlPattern = /^https?\:\/\/.{1,}\/.{1,}$/;

    $scope.digestConfig = {
      selection: 'disabled'
    };

    var getSelection = function getSelection() {
      if (config.configMode.enabled) {
        if (!config.configMode.useGlobalDigestId) {
          $scope.digestConfig.selection = 'useCustomDigest';
          customDigestSelected(true);
        } else {
          $scope.digestConfig.selection = 'useGlobalDigest';
          globalDigestSelected(true);
        }
      }
    };

    $scope.inboxName = function () {
      if (!$scope.newInbox.url || $scope.newInbox.url.length < 1) return '...';
      var index = $scope.newInbox.url.lastIndexOf('/');
      if (index < 0) return '...';
      if (index === $scope.newInbox.url.length - 1) return '...';
      return $scope.newInbox.url.substr(index + 1);
    };

    var configSave = function configSave(enabled) {
      config.enabled = enabled;

      if (!config.configured) {
        return resources.$post('instances').then(function (i) {
          instance = i;
          persistentOptions.headers.Bearer = instance.apiKey; // Ensure apiKey for NEW instance
          return instance.$post('digest-create', {}, {
            description: 'Global Repositories List'
          });
        }).then(function (d) {
          digest = d;
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

    var inboxConfigure = function inboxConfigure(inbox) {
      var links = inbox.$links();
      inbox.addCommit = links['add-commit'].href + '?apiKey=' + persistentOptions.headers.Bearer;
      inbox.removeHref = links['self'].href + '?apiKey=' + persistentOptions.headers.Bearer;
    };

    var inboxesGet = function inboxesGet() {
      if (digest) {
        digest.$get('inboxes').then(function (inboxesRes) {
          return inboxesRes.$get('inboxes');
        }).then(function (inboxes) {
          $scope.inboxes.length = 0;
          inboxes.forEach(function (inbox) {
            inboxConfigure(inbox);
            $scope.inboxes.unshift(inbox);
          });
          $scope.getInboxesDone = true;
        })['catch'](errorHandler);
      }
    };

    var inboxesUpdate = function inboxesUpdate(enabled) {
      if (enabled) {
        $timeout(function () {
          $('.inbox-url').select().focus();
          allowTabNavigation();
        });
      } else {
        $timeout(function () {
          preventTabNavigation();
        });
      }
      inboxesGet();
    };

    $scope.enabledChanged = function () {
      $scope.newInbox.url = '';

      var toggle = $('.commitstream-admin .enabled');

      var enabled = toggle.prop('checked');

      $scope.enabledState.applying = true;
      toggle.bootstrapToggle('disable');

      configSave(enabled).then(function (configSaveResult) {
        // TODO need to handle configSaveResult?
        inboxesUpdate(enabled);
      })['catch'](errorHandler)['finally'](function () {
        $scope.enabledState.applying = false;
        toggle.bootstrapToggle('enable');
      });
    };

    var setupScope = function setupScope() {

      $scope.enabledState = {
        enabled: config.enabled,
        applying: false,
        onText: 'Enabled',
        offText: 'Disabled'
      };

      $scope.applying = function () {
        return $scope.enabledState.applying;
      };

      $scope.overlayVisible = function () {
        return $scope.enabledState.applying || !config.enabled;
      };

      setupNewInbox(family);
    };

    $scope.adjustOverlay = function () {
      $timeout(function () {
        var repolistHeight = $('.repos-list').height();
        $('.repos-section .overlay').height(repolistHeight);
      });
    };

    $scope.inboxCreating = false;

    $scope.inboxCreate = function () {
      //TODO: put the first 3 lines after the try in a promise
      try {
        $scope.inboxCreating = true;
        var index = $scope.newInbox.url.lastIndexOf('/');
        $scope.newInbox.name = $scope.newInbox.url.substr(index + 1);

        digest.$post('inbox-create', {}, $scope.newInbox).then(function (inbox) {
          inboxConfigure(inbox);
          $scope.inboxes.unshift(inbox);
          $scope.newInbox.url = '';
          $scope.inboxHighlightTop(inbox.removeHref);
        })['catch'](errorHandler)['finally'](function () {
          $scope.inboxCreating = false;
        });
      } catch (e) {
        $scope.inboxCreating = false;
      }
    };

    $scope.inboxRemove = function (inbox) {
      prompt({
        title: 'Remove Repository?',
        message: 'Are you sure you want to remove the repository ' + inbox.name + '?',
        buttons: [{
          label: 'Remove',
          primary: true,
          'class': 'action-remove'
        }, {
          label: 'Cancel',
          cancel: true,
          'class': 'action-cancel'
        }]
      }).then(function () {
        inbox.$del('self').then(function (result) {
          $scope.message.value = 'Successfully removed repository';
          var index = $scope.inboxes.indexOf(inbox);
          $scope.inboxes.splice(index, 1);
          $timeout(function () {
            $('.commitstream-admin .message').fadeOut('slow', function () {
              $scope.message.value = '';
            });
          }, 4000);
        })['catch'](errorHandler);
      });
    };

    var inboxHighlight = function inboxHighlight(el) {
      if (config.enabled) {
        el.focus();
        el.select();
      }
    };

    $scope.inboxHighlight = function (evt) {
      return inboxHighlight(evt.currentTarget);
    };

    $scope.inboxHighlightTop = function () {
      $timeout(function () {
        var el = $($('.commitstream-admin .inbox')[0]);
        inboxHighlight(el);
      }, 0);
    };

    var getConfig = function getConfig(r) {
      resources = r;
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
      };
      return $http.get(configGetUrl);
    };

    var getInstance = function getInstance(configRes) {
      // TODO handle null case?
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

    var getDigest = function getDigest(i) {
      if (!i) return false;

      instance = i;
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

    var preventTabNavigation = function preventTabNavigation() {
      $("#commitStreamAdmin :input").each(function () {
        $(this).attr('tabindex', '-1');
      });
    };

    var allowTabNavigation = function allowTabNavigation() {
      $("#commitStreamAdmin :input").each(function () {
        $(this).removeAttr('tabindex');
      });
    };

    CommitStreamApi.load().then(getConfig).then(getInstance).then(getDigest).then(function (d) {
      if (d) digest = d;
      setupScope();
      if ($scope.isDigestMode()) getSelection();
      inboxesUpdate(config.enabled);
      loading = false;
    })['catch'](errorHandler);
  }]);
})();
