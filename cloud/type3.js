'use strict';

var AV = require('leanengine');
var GoldenWeek = AV.Object.extend('GoldenWeek');
var UserWeek = AV.Object.extend('GoldenUser');

var hash = require('./hash');

//转运邦
AV.Cloud.define('type3', function (request, response) {

    var userId = request.params.userId || '';
    var purchaseId = request.params.purchaseId || '';
    var type = request.params.type || '';
    var signature = request.params.signature || '';

    if(!hash(signature,userId,purchaseId)) {
        return response.error('Success Error');
    }

    var userQuery = new AV.Query(UserWeek);
    
    userQuery.equalTo('userId', userId);

    userQuery.first({
        success: function (data) {

            if (data) {
                
                if (data.get('type') === type) {
                    response.success({
                        success: 0,
                        msg: '您的账户只能领取一次优惠码',
                        code: data.get('code'),
                        type: data.get('type')
                    });
                } else {
                    response.success({
                        success: 3,
                        msg: '同一purchase只能领取一次优惠码'
                    });
                }
                
            } else {

                var codeQuery = new AV.Query(GoldenWeek);
                codeQuery.equalTo('type', type);

                codeQuery.first({
                    success: function (_data) {
                        
                        if(!_data) {
                            return response.success({
                                success:2,
                                msg:'优惠码已领取完'
                            });
                        }
                        
                        var codeQuerySaveUser = new UserWeek();
                        codeQuerySaveUser.set('code', _data.get('code'));
                        codeQuerySaveUser.set('type', type);
                        codeQuerySaveUser.set('userId', userId);
                        codeQuerySaveUser.set('purchaseId', purchaseId);
                        codeQuerySaveUser.save(null, {
                            success: function () {
                                _data.destroy().then(function() {
                                    response.success({
                                        success: 1,
                                        msg: '领取优惠码成功！',
                                        code:_data.get('code')
                                    });
                                });
                            },
                            error: function (err) {
                                response.error(err);
                            }
                        });

                    },
                    error: function (err) {
                        response.error(err);
                    }
                });


            }

        },
        error: function (err) {
            response.error(err);
        }
    });


});