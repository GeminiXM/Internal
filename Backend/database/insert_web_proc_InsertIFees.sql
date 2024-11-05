-- Execute the stored procedure directly in Informix
EXECUTE PROCEDURE web_proc_InsertIFee(
    parDescription,
    parStartDate,
    parEndDate,
    parPrice,
    parEnteredBy
);
