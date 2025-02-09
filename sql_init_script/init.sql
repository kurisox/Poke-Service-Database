-- SQL initialization script
-- Creates table for generation in which the pokemon was introduced
CREATE TABLE
    IF NOT EXISTS GENERATRIONS (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(255) NOT NULL
    );

-- Create table for pokemon types
CREATE TABLE
    IF NOT EXISTS TYPES (
        id INT PRIMARY KEY NOT NULL,
        type VARCHAR(255) NOT NULL
    );

-- Create teable for the pokemon abilities and sub-information 
CREATE TABLE
    IF NOT EXISTS LANGUAGES (
        id INT AUTO_INCREMENT PRIMARY KEY,
        language VARCHAR(10) NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS ALTERNATIVE_ABILITY_NAMES (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        language_id INT NOT NULL,
        ability_id INT NOT NULL,
        FOREIGN KEY (language_id) REFERENCES LANGUAGES (id) FOREIGN KEY (ability_id) REFERENCES ABILITIES (id)
    );

CREATE TABLE
    IF NOT EXISTS ABILITIES (
        id INT PRIMARY KEY NOT NULL,
        name VARCHAR(255) NOT NULL,
        generation_id INT NOT NULL,
        FOREIGN KEY (generation_id) REFERENCES GENERATRIONS (id)
    );

CREATE TABLE
    IF NOT EXISTS EFFECTS (
        id INT AUTO_INCREMENT PRIMARY KEY,
        effect VARCHAR(600) NOT NULL,
        ability_id INT NOT NULL,
        language_id INT NOT NULL,
        FOREIGN KEY (ability_id) REFERENCES ABILITIES (id) FOREIGN KEY (language_id) REFERENCES LANGUAGES (id)
    );

Create table
    if not exists FLAVOUR_TEXT (
        id INT AUTO_INCREMENT PRIMARY KEY,
        flavour_text VARCHAR(255) NOT NULL,
        ability_id INT NOT NULL,
        language_id INT NOT NULL,
        FOREIGN KEY (ability_id) REFERENCES ABILITIES (id) FOREIGN KEY (language_id) REFERENCES LANGUAGES (id)
    )
-- join tables

Create table
    if not exists NO_DAMAGE_TO (
        type_id INT PRIMARY KEY NOT NULL,
        no_dmg_type_id INT PRIMARY KEY NOT NULL,
        FOREIGN KEY (id_type) REFERENCES TYPES (id) FOREIGN KEY (id_weakness) REFERENCES TYPES (id)
    )

