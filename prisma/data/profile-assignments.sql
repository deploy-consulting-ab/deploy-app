-- First, create the profiles
INSERT INTO "Profile" ("id", "name", "description") VALUES
('deploy_admin', 'Deploy:Administrator', 'Full system access'),
('deploy_consultant', 'Deploy:Consultant', 'Standard consultant access'),
('deploy_sales', 'Deploy:Sales', 'Sales team access'),
('deploy_management', 'Deploy:Management', 'Management team access');

-- Then you can view your current users
SELECT id, email, role FROM "User";

-- Update users based on their roles
UPDATE "User"
SET "profileId" = 'deploy_admin'
WHERE "role" = 'ADMIN';

UPDATE "User"
SET "profileId" = 'deploy_consultant'
WHERE "role" = 'CONSULTANT';

UPDATE "User"
SET "profileId" = 'deploy_sales'
WHERE "role" = 'SALES';

UPDATE "User"
SET "profileId" = 'deploy_management'
WHERE "role" = 'MANAGEMENT';