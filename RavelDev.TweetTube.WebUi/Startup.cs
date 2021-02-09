using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using RavelDev.Core.Interfaces;
using RavelDev.Core.Repo;
using RavelDev.TweetTube.SignalR;
using RavelDev.Twitter.Core.API;
using RavelDev.Twitter.Core.Interfaces;
using RavelDev.Twitter.Interfaces;
using RavelDev.Twitter.Repos;
using System;

namespace RavelDev.TweetTube
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddScoped<ITwitterModelApi, TwitterModelApi>();
            services.AddScoped<ITwitterWebApi, TwitterWebApi>();
            services.AddSignalR();
            services.AddControllersWithViews();
            services.AddDistributedMemoryCache();
            services.AddSingleton<IRepositoryConfig>(new RepositoryConfig { ConnectionString = Configuration["ConnectionStrings:LocalDb"] });
            services.AddScoped<ITwitterRepository, TwitterRepository>();
            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromSeconds(1800);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                //que es 'Hsts'?
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseSession();
            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapHub<TweetParsingHub>("/hubs/tweetupdates");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
