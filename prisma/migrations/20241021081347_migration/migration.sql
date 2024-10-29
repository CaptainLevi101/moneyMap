/*
  Warnings:

  - You are about to drop the column `day` on the `YearHistory` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_YearHistory" (
    "userId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "expense" REAL NOT NULL,
    "incomes" REAL NOT NULL,

    PRIMARY KEY ("month", "year", "userId")
);
INSERT INTO "new_YearHistory" ("expense", "incomes", "month", "userId", "year") SELECT "expense", "incomes", "month", "userId", "year" FROM "YearHistory";
DROP TABLE "YearHistory";
ALTER TABLE "new_YearHistory" RENAME TO "YearHistory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
