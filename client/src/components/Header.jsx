import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import NotificationBell from "./NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import {
  Leaf,
  Menu,
  User,
  LogOut,
  Settings,
  Award,
  Users,
  BookOpen,
  Tent,
  Recycle,
  BarChart,
  ChevronDown,
} from "lucide-react";

const Header = () => {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function getUserLevel(points) {
    if (points >= 1000) return "Eco Master";
    if (points >= 500) return "Eco Champion";
    if (points >= 200) return "Eco Warrior";
    if (points >= 50) return "Eco Explorer";
    return "Beginner";
  }

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Classify Waste", href: "/classify" },
    { name: "Campaigns", href: "/campaigns" },
    { name: "Blog", href: "/blog" },
    { name: "Leaderboard", href: "/leaderboard" },
  ];

  // Admin navigation items
  const adminItems = [{ name: "Admin", href: "/admin" }];

  // Manage dropdown items for admin
  const manageItems = [
    {
      name: "Users",
      href: "/admin/users",
      icon: <Users className="h-4 w-4 mr-2" />,
    },
    {
      name: "Blogs",
      href: "/admin/blogs",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
    },
    {
      name: "Campaigns",
      href: "/admin/campaigns",
      icon: <Tent className="h-4 w-4 mr-2" />,
    },
    {
      name: "Disposal Requests",
      href: "/admin/requests",
      icon: <Recycle className="h-4 w-4 mr-2" />,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart className="h-4 w-4 mr-2" />,
    },
  ];

  const isActive = (href) => location === href;
  const isManageActive = () =>
    manageItems.some((item) => location === item.href);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setLocation("/");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">EcoWise</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <span
                  className={`font-medium transition-colors cursor-pointer ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            ))}

            {/* Admin Items */}
            {user?.role === "admin" && (
              <>
                {adminItems.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <span
                      className={`font-medium transition-colors cursor-pointer ${
                        isActive(item.href)
                          ? "text-primary"
                          : "text-gray-700 hover:text-primary"
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                ))}

                {/* Manage Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div
                      className={`flex items-center space-x-1 font-medium cursor-pointer ${
                        isManageActive()
                          ? "text-primary"
                          : "text-gray-700 hover:text-primary"
                      }`}
                    >
                      <span>Manage</span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Manage Content</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {manageItems.map((item) => (
                        <DropdownMenuItem key={item.name} asChild>
                          <Link
                            href={item.href}
                            className="w-full flex items-center"
                          >
                            {item.icon}
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Eco Points Display */}
                <NotificationBell />
                <div className="flex items-center space-x-1 bg-amber-50 px-3 py-1 rounded-full">
                  <Award className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700">
                    {user?.ecoPoints || 0}
                  </span>
                </div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user?.profileImage}
                          alt={user?.username}
                        />
                        <AvatarFallback>
                          {user?.username?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.username}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                        <p className="text-xs text-primary font-medium">
                          Level: {getUserLevel(user?.ecoPoints || 0)}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="text-primary border-primary hover:bg-primary hover:text-white"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary/90">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
               { isAuthenticated &&(<NotificationBell className="mb-4" />) }
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-6">
                  {/* Logo */}
                  <div className="flex items-center space-x-2 pb-4 border-b">
                    <Leaf className="h-6 w-6 text-primary" />
                    <span className="text-lg font-bold">EcoWise</span>
                  </div>

                  {/* User Info (if authenticated) */}
                  {isAuthenticated && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user?.profileImage}
                            alt={user?.username}
                          />
                          <AvatarFallback>
                            {user?.username?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user?.username}</p>
                          <p className="text-sm text-gray-600">
                            {getUserLevel(user?.ecoPoints || 0)}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Award className="h-3 w-3 text-amber-600" />
                            <span className="text-xs text-amber-700">
                              {user?.ecoPoints || 0} points
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <nav className="space-y-2">
                    {navigationItems.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <div
                          className={`block py-3 px-4 rounded-lg font-medium transition-colors cursor-pointer ${
                            isActive(item.href)
                              ? "bg-primary text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </div>
                      </Link>
                    ))}

                    {/* Admin Items */}
                    {user?.role === "admin" && (
                      <>
                        {adminItems.map((item) => (
                          <Link key={item.name} href={item.href}>
                            <div
                              className={`block py-3 px-4 rounded-lg font-medium transition-colors cursor-pointer ${
                                isActive(item.href)
                                  ? "bg-primary text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item.name}
                            </div>
                          </Link>
                        ))}

                        {/* Manage Section Header */}
                        <div className="pt-1 pb-1 px-4 text-sm font-semibold text-gray-500">
                          Manage
                        </div>

                        {/* Manage Items */}
                        {manageItems.map((item) => (
                          <Link key={item.name} href={item.href}>
                            <div
                              className={`flex items-center py-3 px-4 rounded-lg font-medium transition-colors cursor-pointer ${
                                isActive(item.href)
                                  ? "bg-primary text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {React.cloneElement(item.icon, {
                                className: `mr-2 h-4 w-4 ${
                                  isActive(item.href) ? "text-white" : ""
                                }`,
                              })}
                              {item.name}
                            </div>
                          </Link>
                        ))}
                      </>
                    )}
                  </nav>

                  {/* Auth buttons */}
                  <div className="pt-4 border-t space-y-3">
                    {isAuthenticated ? (
                      <>
                        <Link href="/profile">
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Button>
                        </Link>
                        {user?.role === "admin" && (
                          <Link href="/admin">
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Admin Dashboard
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="outline"
                          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/login">
                          <Button
                            variant="outline"
                            className="w-full mb-4"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Login
                          </Button>
                        </Link>
                        <Link href="/register">
                          <Button
                            className="w-full bg-primary hover:bg-primary/90"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Sign Up
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
