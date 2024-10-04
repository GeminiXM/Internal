-- Construct the query string with parameters
DECLARE @qryInsertIFees NVARCHAR(MAX);
SET @InsertIFees = N'EXECUTE PROCEDURE web_proc_InsertIFee ()';

-- Execute the dynamic SQL on the linked server
EXEC (@InsertIFees) AT BOSS_Denver;