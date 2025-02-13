-- SQL initialization script
CREATE DATABASE IF NOT EXISTS poke_service_db;

USE poke_service_db;

-- Create for the aviable languages 
CREATE TABLE
    IF NOT EXISTS LANGUAGES (
        id INT AUTO_INCREMENT,
        language VARCHAR(10) NOT NULL,
        primary key (id)
    );

-- Create table for the available generations
CREATE TABLE
    IF NOT EXISTS TYPES (
        id INT NOT NULL,
        name VARCHAR(20) NOT NULL,
        primary key (id)
    );

-- Creates table for generation in which the pokemon was introduced
CREATE TABLE
    IF NOT EXISTS GENERATIONS (
        id INT AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        primary key (id)
    );

CREATE TABLE
    IF NOT EXISTS ABILITIES (
        id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        generation_id INT NOT NULL,
        primary key (id)
    );

CREATE TABLE
    IF NOT EXISTS ALTERNATIVE_ABILITY_NAMES (
        id INT AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        language_id INT NOT NULL,
        ability_id INT NOT NULL,
        primary key (id)
    );


CREATE TABLE
    IF NOT EXISTS EFFECTS (
        id INT AUTO_INCREMENT,
        effect VARCHAR(2000) NOT NULL,
        ability_id INT NOT NULL,
        language_id INT NOT NULL,
        primary key (id)
    );

Create table
    if not exists FLAVOUR_TEXTS (
        id INT AUTO_INCREMENT,
        flavour_text VARCHAR(255) NOT NULL,
        ability_id INT NOT NULL,
        language_id INT NOT NULL,
        primary key (id)
    );

-- join tables
Create table
    if not exists NO_DAMAGE_TO (
        type_id INT NOT NULL,
        reference_type_id INT NOT NULL,
        primary key (type_id, reference_type_id)
    );

Create table
    if not exists HALF_DAMAGE_TO (
        type_id INT NOT NULL,
        reference_type_id INT NOT NULL,
        primary key (type_id, reference_type_id)
    );

Create table
    if not exists DOUBLE_DAMAGE_TO (
        type_id INT NOT NULL,
        reference_type_id INT NOT NULL,
        primary key (type_id, reference_type_id)
    );

Create table
    if not exists NO_DAMAGE_FROM (
        type_id INT NOT NULL,
        reference_type_id INT NOT NULL,
        primary key (type_id, reference_type_id)
    );

Create table
    if not exists HALF_DAMAGE_FROM (
        type_id INT NOT NULL,
        reference_type_id INT NOT NULL,
        primary key (type_id, reference_type_id)
    );

Create table
    if not exists DOUBLE_DAMAGE_FROM (
        type_id INT NOT NULL,
        reference_type_id INT NOT NULL,
        primary key (type_id, reference_type_id)
    );

-- create constraints
alter table ALTERNATIVE_ABILITY_NAMES add constraint `ALTERNATIVE_ABILITY_NAMES_LANGUAGES` foreign key (language_id) references LANGUAGES (id) on delete cascade;

alter table ALTERNATIVE_ABILITY_NAMES add constraint `ALTERNATIVE_ABILITY_NAMES_ABILITIES` foreign key (ability_id) references ABILITIES (id) on delete cascade;

alter table ABILITIES add constraint `ABILITIES_GENERATIONS` foreign key (generation_id) references GENERATIONS (id) on delete cascade;

alter table EFFECTS add constraint `EFFECTS_ABILITIES` foreign key (ability_id) references ABILITIES (id) on delete cascade;

alter table EFFECTS add constraint `EFFECTS_LANGUAGES` foreign key (language_id) references LANGUAGES (id) on delete cascade;

alter table FLAVOUR_TEXTS add constraint `FLAVOUR_TEXT_ABILITIES` foreign key (ability_id) references ABILITIES (id) on delete cascade;

alter table FLAVOUR_TEXTS add constraint `FLAVOUR_TEXT_LANGUAGES` foreign key (language_id) references LANGUAGES (id) on delete cascade;

alter table NO_DAMAGE_TO add constraint `NO_DAMAGE_TO_TYPES` foreign key (type_id) references TYPES (id) on delete cascade;

alter table NO_DAMAGE_TO add constraint `NO_DAMAGE_TO_TYPES2` foreign key (reference_type_id) references TYPES (id) on delete cascade;

alter table HALF_DAMAGE_TO add constraint `HALF_DAMAGE_TO_TYPES` foreign key (type_id) references TYPES (id) on delete cascade;

alter table HALF_DAMAGE_TO add constraint `HALF_DAMAGE_TO_TYPES2` foreign key (reference_type_id) references TYPES (id) on delete cascade;

alter table DOUBLE_DAMAGE_TO add constraint `DOUBLE_DAMAGE_TO_TYPES` foreign key (type_id) references TYPES (id) on delete cascade;

alter table DOUBLE_DAMAGE_TO add constraint `DOUBLE_DAMAGE_TO_TYPES2` foreign key (reference_type_id) references TYPES (id) on delete cascade;

alter table NO_DAMAGE_FROM add constraint `NO_DAMAGE_FROM_TYPES` foreign key (type_id) references TYPES (id) on delete cascade;

alter table NO_DAMAGE_FROM add constraint `NO_DAMAGE_FROM_TYPES2` foreign key (reference_type_id) references TYPES (id) on delete cascade;

alter table HALF_DAMAGE_FROM add constraint `HALF_DAMAGE_FROM_TYPES` foreign key (type_id) references TYPES (id) on delete cascade;

alter table HALF_DAMAGE_FROM add constraint `HALF_DAMAGE_FROM_TYPES2` foreign key (reference_type_id) references TYPES (id) on delete cascade;

alter table DOUBLE_DAMAGE_FROM add constraint `DOUBLE_DAMAGE_FROM_TYPES` foreign key (type_id) references TYPES (id) on delete cascade;

alter table DOUBLE_DAMAGE_FROM add constraint `DOUBLE_DAMAGE_FROM_TYPES2` foreign key (reference_type_id) references TYPES (id) on delete cascade;

-- values
