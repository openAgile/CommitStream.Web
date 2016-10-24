'use strict';

(function () {
  var commitStreamControllers = angular.module('commitStreamControllers', []);

  commitStreamControllers.controller('CommitStreamAdminController', ['$scope', 'CommitStreamApi', '$timeout', 'serviceUrl', 'configGetUrl', 'configSaveUrl', '$http', '$q', 'prompt', '$location', 'persistentOptions', function ($scope, CommitStreamApi, $timeout, serviceUrl, configGetUrl, configSaveUrl, $http, $q, prompt, $location, persistentOptions) {

    var loading = true,
        config = undefined,
        resources = undefined,
        instance = undefined,
        digest = undefined;

    var inboxesDone = false;

    var getInboxesDone = function getInboxesDone() {
      loading = false;
      inboxesDone = true;
      if (config.enabled) {
        allowTabNavigation();
      } else {
        preventTabNavigation();
      }
    };

    var isInboxesDone = function isInboxesDone() {
      return inboxesDone;
    };

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

    // Only display when we actually have the config in $scope!
    $scope.isAdminPanelVisible = function () {
      return config && (instance || !config.configured);
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
      getGlobalDigest(config).then(function (_digest) {
        digest = _digest;
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
      inboxesDone = false;
      $scope.inboxes = [];
      resetFamily();
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
      return isGlobalDigest() ? 'glyphicon glyphicon-check' : 'glyphicon glyphicon-unchecked';
    };

    $scope.radioButtonCustom = function () {
      return isCustomDigest() ? 'glyphicon glyphicon-check' : 'glyphicon glyphicon-unchecked';
    };

    $scope.radioButtonDisabled = function () {
      return !isCustomDigest() && !isGlobalDigest() ? 'glyphicon glyphicon-check' : 'glyphicon glyphicon-unchecked';
    };

    $scope.isInstanceMode = function () {
      return !config.configMode ? true : config.configMode.type === 'instance';
    };

    $scope.isDigestMode = function () {
      return config.configMode && config.configMode.type === 'digest';
    };

    $scope.areRepositoriesVisible = function () {
      return ($scope.isInstanceMode() || isGlobalDigest() || isCustomDigest()) && isInboxesDone();
    };

    $scope.editAllowed = function () {
      return $scope.isInstanceMode() || isCustomDigest();
    };

    $scope.getHeading = function () {
      if (isInboxesDone()) {
        if ($scope.isInstanceMode()) return 'Setup Global Repositories';
        if ($scope.isDigestMode()) {
          if (isCustomDigest()) {
            return 'Setup TeamRoom Repositories';
          } else return $scope.inboxes.length > 0 ? 'Active Global Repositories' : 'Your administrator has not added any global repositories';
        }
      }
    };

    var family = '';
    var familyHover = '';

    $scope.familySelect = function (newFamily) {
      family = newFamily;
      setupNewInbox(family);
    };

    $scope.familyHover = function (familyName) {
      return familyHover = familyName;
    };

    $scope.familyIsSelectedClass = function (familyName) {
      return family === familyName ? 'family-selected' : '';
    };

    $scope.familyIsSelectedIcon = function (familyName) {
      return family === familyName || familyHover === familyName ? 'icon-' + familyName + '-selected-32x32.png' : 'icon-' + familyName + '-nonselected-32x32.png';
    };

    $scope.familyIsSelected = function (familyName) {
      return family === familyName;
    };

    $scope.familyHasBeenSelected = function () {
      return family !== '';
    };

    $scope.familyIcon = function (familyName) {
      return serviceUrl + '/icon-' + familyName.toLowerCase() + '-selected-32x32.png';
    };

    $scope.familyOptionIcon = function (familyOptionName) {
      return serviceUrl + '/icon-' + familyOptionName.toLowerCase() + '-selected-24x24.png';
    };

    var setupNewInbox = function setupNewInbox(selectedFamily) {
      return $scope.newInbox = {
        url: '',
        name: '',
        family: selectedFamily
      };
    };

    var resetFamily = function resetFamily() {
      return $scope.familySelect('');
    };

    $scope.serviceUrl = serviceUrl;
    $scope.inboxes = [];

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

    $scope.urlPattern = (function () {
      var regex = '';
      return {
        test: function test(value) {
          if (family === "P4V") {
            regex = /^(\\(\\[^\s\\]+)+|([A-Za-z]:(\\)?|[A-z]:(\\[^\s\\]+)+))(\\)?$/;
          } else {
            regex = /^https?\:\/\/.{1,}\/.{1,}$/;
          }
          return regex.test(value);
        }
      };
    })();

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
        return resources.$post('instances').then(function (_instance) {
          instance = _instance;
          persistentOptions.headers.Bearer = instance.apiKey; // Ensure apiKey for NEW instance
          return instance.$post('digest-create', {}, {
            description: 'Global Repositories List'
          });
        }).then(function (_digest) {
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

    $scope.hoverEdit = false;

    var inboxConfigure = function inboxConfigure(inbox) {
      var links = inbox.$links();
      inbox.addCommit = links['add-commit'].href + '?apiKey=' + persistentOptions.headers.Bearer;
      inbox.removeHref = links['self'].href + '?apiKey=' + persistentOptions.headers.Bearer;
      inboxExternalResourceScript(inbox);
    };

    $scope.hasResourceToDownload = function (families) {
      var thereIs = false;
      $scope.inboxes.forEach(function (inbox) {
        var index = families.indexOf(inbox.family);
        if (index != -1) {
          thereIs = true;
        }
      });
      return thereIs;
    };

    $scope.getHelpIconSrc = function () {
      return serviceUrl + '/icon-help-16x16.png';
    };

    $scope.svnScriptPlatformIcon = function (platform, mouseHover) {
      return mouseHover ? serviceUrl + '/icon-' + platform + '-selected-24x24.png' : serviceUrl + '/icon-' + platform + '-nonselected-24x24.png';
    };

    // we need to use this function declaration in both of the below functions to make use of "this"
    // "this" need to be bound to the <a> element
    $scope.hoverIn = function () {
      this.mouseHover = true;
    };

    $scope.hoverOut = function () {
      this.mouseHover = false;
    };

    var inboxExternalResourceScript = function inboxExternalResourceScript(inbox) {
      if (inbox.family == "Svn") {
        inbox.$get('svn-scripts').then(function (scripts) {
          var scriptUrl = [];
          scripts.forEach(function (script) {
            var links = script.$links();
            scriptUrl.push({
              'href': links['self'].href + '&apiKey=' + persistentOptions.headers.Bearer,
              'platform': script.platform
            });
          });
          inbox.scripts = scriptUrl;
        });
      }
      if (inbox.family == "P4V") {
        inbox.$get('p4v-scripts').then(function (scripts) {
          var scriptUrl = [];
          scripts.forEach(function (script) {
            var links = script.$links();
            scriptUrl.push({
              'href': links['self'].href + '&apiKey=' + persistentOptions.headers.Bearer,
              'platform': script.platform
            });
          });
          inbox.scripts = scriptUrl;
        });
      }
    };

    $scope.showTooltip = false;

    $scope.clickTooltip = function () {
      $scope.showTooltip = !$scope.showTooltip;
    };

    var inboxesGet = function inboxesGet() {
      loading = true;
      if (digest) {
        digest.$get('inboxes').then(function (inboxesRes) {
          return inboxesRes.$get('inboxes');
        }).then(function (inboxes) {
          $scope.inboxes.length = 0;
          inboxes.forEach(function (inbox) {
            inboxConfigure(inbox);
            $scope.inboxes.unshift(inbox);
          });
          if ($scope.inboxes.length > 0) {
            $scope.familySelect($scope.inboxes[0].family);
          }
          getInboxesDone();
        })['catch'](errorHandler);
      } else {
        getInboxesDone();
      }
    };

    var inboxesUpdate = function inboxesUpdate(enabled) {
      if (enabled) {
        $timeout(function () {
          $('.inbox-url').select().focus();
        }, 1000);
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
      return $timeout(function () {
        var repolistHeight = $('.repos-list').height();
        $('.repos-section .overlay').height(repolistHeight);
      });
    };

    $scope.inboxCreating = false;

    $scope.inboxCreate = function () {
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
      return prompt({
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
      return $timeout(function () {
        var el = $($('.commitstream-admin .inbox')[0]);
        inboxHighlight(el);
      }, 0);
    };

    var getConfig = function getConfig(_resources) {
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

    var getDigest = function getDigest(_instance) {
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

    var preventTabNavigation = function preventTabNavigation() {
      $timeout(function () {
        $("#commitStreamAdmin :input").each(function () {
          $(this).attr('tabindex', '-1');
        });
        $("#commitStreamAdmin :button").each(function () {
          $(this).attr('tabindex', '-1');
        });
        $("#commitStreamAdmin :link").each(function () {
          $(this).attr('tabindex', '-1');
        });
      }, 1000);
    };

    var allowTabNavigation = function allowTabNavigation() {
      $timeout(function () {
        $("#commitStreamAdmin :input").each(function () {
          $(this).removeAttr('tabindex');
        });
        $("#commitStreamAdmin :button").each(function () {
          $(this).removeAttr('tabindex');
        });
        $("#commitStreamAdmin :link").each(function () {
          $(this).removeAttr('tabindex');
        });
      }, 1000);
    };

    CommitStreamApi.load().then(getConfig).then(getInstance).then(getDigest).then(function (_digest) {
      if (_digest) digest = _digest;
      setupScope();
      if ($scope.isDigestMode()) {
        getSelection();
      } else {
        inboxesUpdate(config.enabled);
      }
      loading = false;
    })['catch'](errorHandler);
  }]);
})();
