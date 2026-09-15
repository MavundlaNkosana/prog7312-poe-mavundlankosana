using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SmartX.Server.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Register controllers instead of Minimal APIs
builder.Services.AddControllers();

// Register Swagger for easy API testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register our custom Telemetry Buffer as a Singleton so it persists across requests
builder.Services.AddSingleton<TelemetryIngestionBuffer>();
builder.Services.AddLogging();

// Enable CORS so the React app can communicate with this API
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Apply CORS policy before routing/authorization
app.UseCors();

app.UseAuthorization();

// Map the API endpoints defined in TelemetryController.cs
app.MapControllers();

app.Run();