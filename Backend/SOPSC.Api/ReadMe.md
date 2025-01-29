Accessing a new SQL DB Table Intructions:
	1. (SSMS) Verify SQL table exists and has data/validate
(.NET):
	2.	Interface name "ITableService.cs" in SOPSC.Api/Services/Interfaces.
		a.	Declare functions for each proc associated with the table.
				Create(example):
					int Add(TableAddRequest model, int userId);
				Read(example):
					List<Table> GetAll();
				Update(example):
					void Update(TableUpdateRequest model);
				Delete(example):
					void Delete(int id);
		b.	For the model parameter:
				Create a new file in SOPSC.Api/Models/Requests
					"TableAddRequest.cs"
					"TableUpdateRequest.cs"
				Declare properties for each column in the table following this
				format:
					[Required]		(only use required for non-nullable columns)
					[MaxLength(100)]
					public string Name { get; set; }
					[Required]
					[Range(0, int.MaxValue)]
					public int StatusId { get; set; }
	3.	Controller name "TablesController.cs" in SOPSC.Api/Controllers
		a.	Specify controller route.
		b.	Controllers Inherits from BaseApiController giving response
			/logging capabilities.
		c.	Declare Interface object with name, "_tableService" and assign
			it to null.
		d.	Declare IAuthenticationService<int> object with name, "_authService"
			and assign it to null.
		e.	Create a constructor with parameters, 
				"ITableService service"
				"ILogger<TablesController> logger"
				"IAuthenticationService<int> authService"
			and inherit the controller from base(logger)
		f. Assign
				"_tableService" = service
				"_authService" = authService
		g. Create #region's for all create, read, update, delete methods