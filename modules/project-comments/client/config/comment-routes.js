'use strict';
// =========================================================================
//
// comment period routes
//
// =========================================================================
angular.module('core').config(['$stateProvider', function ($stateProvider) {
	$stateProvider
	// -------------------------------------------------------------------------
	//
	// this is the abstract, top level view for comment periods.
	// since it is a child of p (project), the project injection has already
	// been resolved and is available to subsequent child states as 'project'
	// here we will resolve the list of periods for this project, which will
	// also become available to child states as 'periods'
	//
	// -------------------------------------------------------------------------
	.state('p.commentperiod', {
		abstract:true,
		url: '/commentperiod',
		template: '<ui-view></ui-view>',
		resolve: {
			periods: function ($stateParams, CommentPeriodModel, project) {
				console.log ('commentperiod abstract resolving periods');
				console.log ('project id = ', project._id);
				return CommentPeriodModel.getPeriodsForProject (project._id);
			},
		}
	})
	// -------------------------------------------------------------------------
	//
	// the list state for comment periods, project and periods are guaranteed to
	// already be resolved
	//
	// -------------------------------------------------------------------------
	.state('p.commentperiod.list', {
		url: '/list',
		templateUrl: 'modules/project-comments/client/views/period-list.html',
		controller: function ($scope, NgTableParams, periods, project) {
			$scope.tableParams = new NgTableParams ({count:10}, {dataset: periods});
			$scope.project = project;
		}
	})
	// -------------------------------------------------------------------------
	//
	// this is the add, or create state. it is defined before the others so that
	// it does not conflict
	//
	// -------------------------------------------------------------------------
	.state('p.commentperiod.create', {
		url: '/create',
		templateUrl: 'modules/project-comments/client/views/period-edit.html',
		resolve: {
			period: function (CommentPeriodModel) {
				return CommentPeriodModel.getNew ();
			}
		},
		controller: function ($scope, $state, project, period, CommentPeriodModel) {
			$scope.period = period;
			$scope.project = project;
			$scope.save = function () {
				CommentPeriodModel.add ($scope.period)
				.then (function (model) {
					$state.transitionTo('p.commentperiod.list', {project:project._id}, {
			  			reload: true, inherit: false, notify: true
					});
				})
				.catch (function (err) {
					console.error (err);
					alert (err);
				});
			};
		}
	})
	// -------------------------------------------------------------------------
	//
	// this is the edit state
	//
	// -------------------------------------------------------------------------
	.state('p.commentperiod.edit', {
		url: '/:periodId/edit',
		templateUrl: 'modules/project-comments/client/views/period-edit.html',
		resolve: {
			period: function ($stateParams, CommentPeriodModel) {
				console.log ('editing periodId = ', $stateParams.periodId);
				return CommentPeriodModel.getModel ($stateParams.periodId);
			}
		},
		controller: function ($scope, $state, period, project, CommentPeriodModel) {
			console.log ('period = ', period);
			$scope.period = period;
			$scope.project = project;
			$scope.save = function () {
				CommentPeriodModel.save ($scope.period)
				.then (function (model) {
					console.log ('period was saved',model);
					console.log ('now going to reload state');
					$state.transitionTo('p.commentperiod.list', {project:project._id}, {
			  			reload: true, inherit: false, notify: true
					});
				})
				.catch (function (err) {
					console.error (err);
					alert (err);
				});
			};
		}
	})
	// -------------------------------------------------------------------------
	//
	// this is the 'view' mode of a comment period. here we are just simply
	// looking at the information for this specific object
	//
	// -------------------------------------------------------------------------
	.state('p.commentperiod.detail', {
		url: '/:periodId',
		templateUrl: 'modules/project-comments/client/views/period-view.html',
		resolve: {
			period: function ($stateParams, CommentPeriodModel) {
				console.log ('periodId = ', $stateParams.periodId);
				return CommentPeriodModel.getModel ($stateParams.periodId);
			}
		},
		controller: function ($scope, period, project) {
			console.log ('period = ', period);
			$scope.period = period;
			$scope.project = project;
		}
	})

	;

}]);










