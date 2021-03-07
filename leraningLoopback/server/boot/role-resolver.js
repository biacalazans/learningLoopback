module.exports = function (app) {
  var Role = app.models.Role;

  Role.registerResolver('teamMember', function (role, context, cb) {
    function reject() {
      process.nextTick(function () {
        cb(null, false);
      });
    }
    if (context.modelName !== 'project') {
      return reject();
    }

    var userId = context.accessToken.userId;
    if (!userId) {
      return reject();
    }

    context.model.findById(context.modelId, function (err, project) {
      if (err || !project)
        return reject();

      var Team = app.models.Team;
      Team.count({
        ownerId: project.ownerId,
        memberId: userId
      }, function (err, count) {
        if (err) {
          console.log(err);
          return cb(null, false)
        }

        cb(null, count > 0);
      })
    })
  })
}
