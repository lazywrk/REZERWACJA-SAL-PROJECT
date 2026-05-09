const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'University Room Booking System API',
            version: '1.0.0',
            description: 'Professional backend API for university room reservation system'
        },

        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server'
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },

            schemas: {
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', example: 'admin@university.com' },
                        password: { type: 'string', example: 'Admin123!' }
                    }
                },

                RegisterRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', example: 'student1@university.com' },
                        password: { type: 'string', example: 'Student123!' }
                    }
                },

                RoomCreate: {
                    type: 'object',
                    required: ['name', 'building_id', 'capacity', 'type'],
                    properties: {
                        name: { type: 'string', example: 'A101' },
                        building_id: { type: 'integer', example: 1 },
                        capacity: { type: 'integer', example: 80 },
                        type: { type: 'string', example: 'lecture' },
                        description: { type: 'string', example: 'Main lecture room' },
                        max_booking_minutes: { type: 'integer', example: 120 }
                    }
                },

                RoomUpdate: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', example: 'A101' },
                        capacity: { type: 'integer', example: 100 },
                        type: { type: 'string', example: 'seminar' },
                        status: {
                            type: 'string',
                            enum: ['free', 'maintenance'],
                            example: 'maintenance',
                            description: 'Manual room status. Occupied is calculated automatically.'
                        },
                    }
                },

                BookingCreate: {
                    type: 'object',
                    required: ['room_id', 'start_time', 'end_time'],
                    properties: {
                        room_id: { type: 'integer', example: 1 },
                        start_time: {
                            type: 'string',
                            example: '2026-04-25T10:00:00'
                        },
                        end_time: {
                            type: 'string',
                            example: '2026-04-25T12:00:00'
                        }
                    }
                },

                EquipmentAssign: {
                    type: 'object',
                    required: ['room_id', 'equipment_id'],
                    properties: {
                        room_id: { type: 'integer', example: 1 },
                        equipment_id: { type: 'integer', example: 2 }
                    }
                }
            }
        },

        security: [
            {
                bearerAuth: []
            }
        ],

        tags: [
            { name: 'Auth', description: 'Authentication system' },
            { name: 'Users', description: 'Users management' },
            { name: 'Rooms', description: 'Rooms management' },
            { name: 'Bookings', description: 'Bookings management' },
            { name: 'Equipment', description: 'Equipment management' },
            { name: 'Export', description: 'Reports export' },
            { name: 'Stats', description: 'System statistics' }
        ],

        paths: {
            '/auth/register': {
                post: {
                    tags: ['Auth'],
                    summary: 'Register new user',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/RegisterRequest' }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'User created' },
                        400: { description: 'Bad request' }
                    }
                }
            },

            '/auth/login': {
                post: {
                    tags: ['Auth'],
                    summary: 'Login user',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/LoginRequest' }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'JWT token returned' },
                        401: { description: 'Invalid credentials' }
                    }
                }
            },

            '/users': {
                get: {
                    tags: ['Users'],
                    summary: 'Get all users (admin)',
                    responses: {
                        200: { description: 'Users list' },
                        403: { description: 'Forbidden' }
                    }
                }
            },

            '/users/{id}': {
                delete: {
                    tags: ['Users'],
                    summary: 'Delete user',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'integer' }
                        }
                    ],
                    responses: {
                        200: { description: 'User deleted' }
                    }
                }
            },

            '/rooms': {
                get: {
                    tags: ['Rooms'],
                    summary: 'Get all rooms',
                    responses: {
                        200: { description: 'Rooms list' }
                    }
                },

                post: {
                    tags: ['Rooms'],
                    summary: 'Create room (admin)',
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/RoomCreate' }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Room created' }
                    }
                }
            },

            '/rooms/{id}': {
                get: {
                    tags: ['Rooms'],
                    summary: 'Get room by ID',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'integer' }
                        }
                    ],
                    responses: {
                        200: { description: 'Room details' }
                    }
                },

                patch: {
                    tags: ['Rooms'],
                    summary: 'Update room',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'integer' }
                        }
                    ],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/RoomUpdate' }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Room updated' }
                    }
                },

                delete: {
                    tags: ['Rooms'],
                    summary: 'Delete room',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'integer' }
                        }
                    ],
                    responses: {
                        200: { description: 'Room deleted' }
                    }
                }
            },

            '/rooms/availability': {
                get: {
                    tags: ['Rooms'],
                    summary: 'Check room availability'
                }
            },

            '/rooms/calendar': {
                get: {
                    tags: ['Rooms'],
                    summary: 'Room calendar'
                }
            },

            '/bookings': {
                get: {
                    tags: ['Bookings'],
                    summary: 'Get bookings'
                },

                post: {
                    tags: ['Bookings'],
                    summary: 'Create booking',
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/BookingCreate' }
                            }
                        }
                    }
                }
            },

            '/bookings/{id}/cancel': {
                patch: { // ✅ FIX
                    tags: ['Bookings'],
                    summary: 'Cancel booking',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'integer' }
                        }
                    ]
                }
            },

            '/equipment': {
                get: {
                    tags: ['Equipment'],
                    summary: 'Get equipment list'
                },

                post: {
                    tags: ['Equipment'],
                    summary: 'Add equipment'
                }
            },

            '/equipment/{id}': {
                delete: {
                    tags: ['Equipment'],
                    summary: 'Delete equipment'
                }
            },

            '/equipment/assign': {
                post: {
                    tags: ['Equipment'],
                    summary: 'Assign equipment to room',
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/EquipmentAssign' }
                            }
                        }
                    }
                }
            },

            '/export/bookings': {
                get: {
                    tags: ['Export'],
                    summary: 'Export bookings CSV'
                }
            },

            '/export-pdf/bookings': {
                get: {
                    tags: ['Export'],
                    summary: 'Export bookings PDF'
                }
            },

            '/stats': {
                get: {
                    tags: ['Stats'],
                    summary: 'Admin statistics'
                }
            }
        }
    },

    // Path to the API docs
    apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;