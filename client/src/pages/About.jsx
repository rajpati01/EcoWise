import React from 'react';
import { Shield, Users, BarChart, Leaf } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">About EcoWise</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're on a mission to revolutionize waste management through technology, education, and community action.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Our Mission & Vision</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                At EcoWise, we believe that small, consistent actions can lead to significant environmental impact. Our mission is to empower individuals and communities with the knowledge and tools they need to make informed decisions about waste management.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We envision a world where waste is properly classified, recycled, and managed, reducing the burden on our landfills and oceans. Through our AI-powered technology, educational resources, and community initiatives, we're working towards a cleaner, more sustainable future for all.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.pexels.com/photos/3850512/pexels-photo-3850512.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="EcoWise team working on sustainability projects" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do at EcoWise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-6">
                <Leaf className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Environmental Stewardship</h3>
              <p className="text-gray-600">
                We're committed to protecting and preserving our planet for future generations through sustainable practices and education.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-100 text-secondary-600 mb-6">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Community Empowerment</h3>
              <p className="text-gray-600">
                We believe in the power of collective action and work to build and support communities dedicated to environmental causes.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-100 text-accent-600 mb-6">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Innovation & Accessibility</h3>
              <p className="text-gray-600">
                We harness technology to make sustainable practices accessible to everyone, regardless of their background or experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <BarChart className="h-12 w-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <p className="text-lg">Waste Items Classified</p>
            </div>
            <div>
              <Users className="h-12 w-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <p className="text-lg">Active Community Members</p>
            </div>
            <div>
              <Leaf className="h-12 w-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">250+</div>
              <p className="text-lg">Environmental Campaigns</p>
            </div>
            <div>
              <Shield className="h-12 w-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">20+</div>
              <p className="text-lg">Partner Organizations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4 ">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate individuals dedicated to making a difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="relative mb-4 rounded-full overflow-hidden w-48 h-48 mx-auto">
                <img 
                  src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Rajpati Bhandari" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-display font-semibold">Rajpati Bhandari</h3>
              <p className="text-primary-600 mb-3">Founder & CEO</p>
              <p className="text-gray-600">
                Environmental scientist with a passion for technology and sustainability.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <div className="relative mb-4 rounded-full overflow-hidden w-48 h-48 mx-auto">
                <img 
                  src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Anubhav Pokhrel" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-display font-semibold">Anubhav Pokhrel</h3>
              <p className="text-primary-600 mb-3">CTO</p>
              <p className="text-gray-600">
                AI specialist with expertise in machine learning and computer vision.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center">
              <div className="relative mb-4 rounded-full overflow-hidden w-48 h-48 mx-auto">
                <img 
                  src="https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Bibek Dulal" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-display font-semibold">Bibek Dulal</h3>
              <p className="text-primary-600 mb-3">Community Director</p>
              <p className="text-gray-600">
                Experienced in community building and environmental advocacy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;