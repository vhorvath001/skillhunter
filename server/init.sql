-- database: /home/ubuntu/work/skillhunter/server/skillhunter-db.sqlite
DELETE FROM skill;
DELETE FROM proglang;
INSERT INTO proglang (id, name, sourceFiles, patterns, scopePattern, level, packageSeparator)
    VALUES (0, 'Java', '*.java', '{"patternList":["import ([a-zA-Z0-9\\.]+);"]}', 'EVERYWHERE', 2, '.');
INSERT INTO proglang (id, name, sourceFiles, patterns, scopePattern, level, packageSeparator)
    VALUES (1, 'Python', '*.py', '{"patternList":["from ([a-zA-Z0-9\\.]+) import .*"]}', 'EVERYWHERE', 2, '.');
INSERT INTO skill (id, name, enabled, proglangref, parentref)
    VALUES (0, 'springframework', true, 0, null);
INSERT INTO skill (id, name, enabled, proglangref, parentref)
    VALUES (1, 'integration', true, 0, 0);
INSERT INTO skill (id, name, enabled, proglangref, parentref)
    VALUES (2, 'data', true, 0, 0);
INSERT INTO skill (id, name, enabled, proglangref, parentref)
    VALUES (3, 'boot', true, 0, 0);
INSERT INTO skill (id, name, enabled, proglangref, parentref)
    VALUES (4, 'django', true, 1, null);
INSERT INTO skill (id, name, enabled, proglangref, parentref)
    VALUES (5, 'contrib', true, 1, 4);
INSERT INTO skill (id, name, enabled, proglangref, parentref)
    VALUES (6, 'urls', true, 1, 4);
INSERT INTO skill (id, name, enabled, proglangref, parentref)
    VALUES (7, 'lombok', true, 0, null);
INSERT INTO skill (id, name, enabled, proglangref, parentref)
    VALUES (8, 'apache', true, 0, null);
INSERT INTO skill (id, name, enabled, proglangref, parentref)
    VALUES (9, 'commons', true, 0, 8);