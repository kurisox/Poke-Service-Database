-- SQL initialization script
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
        id INT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        generation_id INT NOT NULL,
        FOREIGN KEY (generation_id) REFERENCES GENERATRIONS (id)
    );

CREATE TABLE
    IF NOT EXISTS GENERATRIONS (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(255) NOT NULL
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
    );