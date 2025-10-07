-- Flyway V1 - init tables
create table if not exists roles (
    id serial primary key,
    name varchar(50) unique not null
);

create table if not exists users (
    id serial primary key,
    email varchar(255) unique not null,
    password varchar(255) not null,
    enabled boolean default true not null
);

create table if not exists user_roles (
    user_id integer not null references users(id) on delete cascade,
    role_id integer not null references roles(id) on delete cascade,
    primary key (user_id, role_id)
);

-- seed roles
insert into roles(name) values ('ADMIN') on conflict do nothing;
insert into roles(name) values ('DOCTOR') on conflict do nothing;
insert into roles(name) values ('PATIENT') on conflict do nothing;
insert into roles(name) values ('USER') on conflict do nothing;
