-- CreateTable
CREATE TABLE "NewsArticle" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "originalContent" TEXT NOT NULL,
    "summarizedContent" TEXT NOT NULL,
    "sourceWebsite" VARCHAR(100),
    "symbol" VARCHAR(10),
    "publishedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "NewsArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsArticle_url_key" ON "NewsArticle"("url");

-- CreateIndex
CREATE INDEX "NewsArticle_symbol_idx" ON "NewsArticle"("symbol");

-- CreateIndex
CREATE INDEX "NewsArticle_publishedAt_idx" ON "NewsArticle"("publishedAt");

-- CreateIndex
CREATE INDEX "NewsArticle_sourceWebsite_idx" ON "NewsArticle"("sourceWebsite");
