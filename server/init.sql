-- database: /home/ubuntu/work/skillhunter/server/skillhunter-db.sqlite
DELETE FROM skill;
DELETE FROM proglang;
INSERT INTO proglang (id, name, sourceFiles, patterns, scopePattern, level, packageSeparator, packageRemovalPattern, removingTLDPackages)
    VALUES (0, 'Java', '*.java', '{"patternList":["import ([a-zA-Z0-9\\.]+);"]}', 'EVERYWHERE', 3, '.', '{"patternList":[{"type":"REMOVING_FROM_PACKAGE","value":"(?<=[a-zA-Z0-9\\.]+)[\\.]{1}[A-Z]{1}[a-zA-Z0-9]*$"},{"type":"IGNORING_PACKAGE","value":"com\\.lv\\.gi\\..+"}]}', 1);
INSERT INTO proglang (id, name, sourceFiles, patterns, scopePattern, level, packageSeparator, removingTLDPackages)
    VALUES (1, 'Python', '*.py', '{"patternList":["import ([a-zA-Z0-9\\.]+);"]}', 'FIRST_OCCURRENCE', 2, '.', 1);
INSERT INTO repository (id, name, desc, host, token)
    VALUES (0, 'LV Gitlab', NULL, 'https://gitlab-gi.group.net/api/v4', 'U2FsdGVkX18+vZaMf3cIv939h21MuZWBK5YA2hsorkL8dpMpkJuZq9BZn3kyL/05')