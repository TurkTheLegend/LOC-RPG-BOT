create table 'database_loc_rpg'.users (
    userId int(10) ,
    name varchar(50) ,
    email varchar(50) ,
    passsword varchar(225) , 
    primary key (userId)
)
engine  = innodb,
auto_increment = 5,
avg_row_length = 4096,
charactor set utf8,
collate utf8_general_ci;

alter table 'database_loc_rpg'.users
add unique index users_email (email);