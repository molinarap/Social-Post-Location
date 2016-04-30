            if (photo.comments.count !== 0) {
                for (var i = 0; i < photo.comments.data.length; i++) {
                    var c = photo.comments.data[i];
                    CommentsPhoto.findOne({
                        id_photo: photo.id,
                        id: c.id
                    }, function(err, existingComment) {
                        if (!existingComment) {
                            var comments_photo = new CommentsPhoto({
                                id_photo: photo.id,
                                id: c.id,
                                text: c.text,
                                created_time: c.created_time,
                                from: {
                                    full_name: c.from,
                                    id: c.from.id,
                                    profile_picture: c.from.profile_picture,
                                    username: c.from.username
                                }
                            });
                            comments_photo.save(function(result) {
                                console.log('commentSave', comments_photo);
                            });

                        } else {
                            console.log('Questo like già esiste', c.id);
                        }
                    });
                }
            }

            if (photo.likes.count !== 0) {
                for (var i = 0; i < photo.likes.data.length; i++) {
                    var l = photo.likes.data[i];
                    LikesPhoto.findOne({
                        id: l.id,
                        id_photo: photo.id
                    }, function(err, existingLike) {
                        if (!existingLike) {
                            var likes_photo = new LikesPhoto({
                                id_photo: photo.id,
                                id: l.id,
                                full_name: l.full_name,
                                profile_picture: l.profile_picture,
                                username: l.username
                            });
                            likes_photo.save(function(result) {
                                console.log('Salvo il like ', l.id);
                            });
                        } else {
                            console.log('Questo like già esiste', l.id);
                        }
                    }).then(function (result) {
                        console.log('then', result);
                    });
                }
            }

            if (photo.users_in_photo.length !== 0) {
                for (var i = 0; i < photo.users_in_photo.length; i++) {
                    var users_in_photo = new UsersInPhoto({
                        id_photo: photo.id,
                        position: {
                            x: photo.users_in_photo[i].position.x,
                            y: photo.users_in_photo[i].position.y,
                        },
                        user: {
                            full_name: photo.users_in_photo[i].user.full_name,
                            id: photo.users_in_photo[i].user.id,
                            profile_picture: photo.users_in_photo[i].user.profile_picture,
                            username: photo.users_in_photo[i].user.username
                        }
                    });
                    users_in_photo.save(function(result) {
                        console.log('userPhotoSave', users_in_photo);
                    });
                }
            }