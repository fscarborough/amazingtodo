namespace AmazingTodo.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateTodoIndexes : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.TodoItems", "Todo", c => c.String(maxLength: 800));
            foreach (string col in new[] { "Todo", "Priority", "DueDate" })
                CreateIndex("TodoItems", col);
        }
        
        public override void Down()
        {
            AlterColumn("dbo.TodoItems", "Todo", c => c.String());
        }
    }
}
