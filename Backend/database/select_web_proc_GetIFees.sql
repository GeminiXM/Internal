-- Construct the query string with parameters
DECLARE @qryGetIFees NVARCHAR(MAX);
SET @qryGetIFees = N'EXECUTE PROCEDURE web_proc_GetIFees ()';

-- Execute the dynamic SQL on the linked server
EXEC (@qryGetIFees) AT BOSS_Denver;